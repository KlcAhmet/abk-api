import { inject } from '@loopback/core';
import { post, Request, requestBody, response, ResponseObject, RestBindings } from '@loopback/rest';
import { ITicket, IUserInfo } from '../models';
import { CollectUsersInfo } from '../mixins';
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
    try {
      const userRemoteInfo: IUserInfo = new CollectUsersInfo(
        this.req,
      ).getUserRemoteInfo();
      await createTicket(<ITicket>{
        ...ticket,
        userRemoteInfo: userRemoteInfo,
      });

      return {
        info: ticket,
        statusCode: 200,
        date: new Date(),
        url: this.req.url,
        headers: Object.assign({}, this.req.headers),
      };
    } catch (error) {
      console.log('error', error);
      return {
        statusCode: 400,
        date: new Date(),
        url: this.req.url,
        headers: Object.assign({}, this.req.headers),
      };
    }
  }
}
