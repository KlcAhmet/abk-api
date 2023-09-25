import { inject } from '@loopback/core';
import { post, Request, requestBody, response, ResponseObject, RestBindings } from '@loopback/rest';
import { ITicket, IUserInfo, TicketModel } from '../models';
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

      const filter = userRemoteInfo.xForwardedFor
        ? {
            'userRemoteInfo.xForwardedFor': userRemoteInfo.xForwardedFor,
          }
        : {'userRemoteInfo.socket': userRemoteInfo.socket};
      tickets = await getTicket(filter);
      
      const newTicket = new TicketModel({
        ...ticket,
        userRemoteInfo: userRemoteInfo,
      });
      const ticketValidation = newTicket.validateSync();

      if (
        // validate ticket request length for flood attack protection (2 tickets allowed per ip)
        tickets.length < 2 &&
        // validate ticket
        !ticketValidation
      ) {
        await createTicket(<ITicket>{
          ...ticket,
          userRemoteInfo: userRemoteInfo,
        });
      } else {
        statusCode = tickets.length >= 2 ? 429 : 422;
        const message: string | undefined = ticketValidation?.message;
        new CustomError('createTicket-controller', message, statusCode);
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
