import { inject } from '@loopback/core';
import { post, Request, requestBody, response, ResponseObject, RestBindings } from '@loopback/rest';
import { ITicket, IUserInfo } from '../models';
import { CollectUsersInfo, CustomError } from '../mixins';
import { createTicket } from '../repositories';

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
    let statusCode: 200 | 400 | 422 = 200;
    let errorMessage: string | undefined = undefined;

    try {
      const userRemoteInfo: IUserInfo = new CollectUsersInfo(
        this.req,
      ).getUserRemoteInfo();

      if (
        ticket.message &&
        ticket.message.length > 0 &&
        ticket.message.length < 1000 &&
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
        errorMessage = 'Invalid ticket';
        statusCode = 422;
        new CustomError('createTicket-controller', errorMessage, statusCode);
      }

      return {
        info: ticket,
        statusCode: statusCode,
        errorMessage: errorMessage,
        date: new Date(),
        url: this.req.url,
        headers: Object.assign({}, this.req.headers),
      };
    } catch (error) {
      new CustomError('createTicket-controller', error?.message, statusCode);
      return {
        statusCode: 422,
        date: new Date(),
        url: this.req.url,
        headers: Object.assign({}, this.req.headers),
      };
    }
  }
}
