import { inject } from '@loopback/core';
import { post, Request, requestBody, response, ResponseObject, RestBindings } from '@loopback/rest';
import { ITicket, IUserInfo } from '../models';
import { CollectUsersInfo, CustomError } from '../mixins';
import { createTicket, getTicket } from '../repositories';

/**
 * OpenAPI response for ticket()
 */
const TICKET_RESPONSE: ResponseObject = {
  description: 'Ticker Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'TickerResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class TicketController {
  static createTicketIpCounter: string[] = [];

  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @post('/ticket')
  @response(200, TICKET_RESPONSE)
  async createTicket(@requestBody() ticket: ITicket): Promise<object> {
    let statusCode: 200 | 400 | 422 | 429 = 200;
    let tickets: Object[] = [];

    try {
      const userRemoteInfo: IUserInfo = new CollectUsersInfo(
        this.req,
      ).getUserRemoteInfo();

      TicketController.createTicketIpCounter.push(
        <string>userRemoteInfo.xForwardedFor || <string>userRemoteInfo.socket,
      );
      const sameIpCount = TicketController.createTicketIpCounter.filter(ip => {
        return (
          ip === userRemoteInfo.xForwardedFor || ip === userRemoteInfo.socket
        );
      }).length;
      if (sameIpCount >= 100)
        TicketController.createTicketIpCounter =
          TicketController.createTicketIpCounter.slice(21);
      if (sameIpCount < 3) {
        const filter = userRemoteInfo.xForwardedFor
          ? {
              'userRemoteInfo.xForwardedFor': userRemoteInfo.xForwardedFor,
            }
          : {'userRemoteInfo.socket': userRemoteInfo.socket};
        tickets = await getTicket(filter);
      }

      if (
        // validate tickets length for ddos attack protection (3 tickets per 1 minute)
        sameIpCount < 3 &&
        tickets.length < 2 &&
        // validate ticket
        ticket.message &&
        ticket.message.length > 0 &&
        ticket.message.length <= 1000 &&
        ticket.name &&
        ticket.name.length > 0 &&
        ticket.name.length < 100 &&
        ticket.mail &&
        ticket.mail.length > 0 &&
        ticket.mail.length < 100
      ) {
        await createTicket(<ITicket>{
          ...ticket,
          userRemoteInfo: userRemoteInfo,
        });
      } else {
        statusCode = tickets.length >= 2 || sameIpCount >= 3 ? 429 : 422;
        new CustomError('createTicket-controller', undefined, statusCode);
      }

      return {
        info: ticket,
        statusCode: statusCode,
        date: new Date(),
        url: this.req.url,
        headers: Object.assign({}, this.req.headers),
      };
    } catch (error) {
      new CustomError('createTicket-controller', error?.message, statusCode);
      return {
        statusCode: 500,
        date: new Date(),
        url: this.req.url,
        headers: Object.assign({}, this.req.headers),
      };
    }
  }
}
