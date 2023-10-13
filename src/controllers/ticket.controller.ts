import { inject } from '@loopback/core';
import { post, Request, requestBody, RestBindings } from '@loopback/rest';
import { ITicket, IUserInfo, TicketModel } from '../models';
import { CollectUsersInfo, CustomError } from '../mixins';
import { createTicket, getTicketsByIP } from '../repositories';

/**
 * A simple controller to bounce back http requests
 */
export class TicketController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @post('/ticket')
  async createTicket(@requestBody() ticket: ITicket): Promise<object> {
    let statusCode: 200 | 400 | 422 | 429 | 500 = 200;
    let tickets: Object[] = [];
    const BRANCH: boolean = process.env.BRANCH === 'develop';

    try {
      const userRemoteInfo: IUserInfo = new CollectUsersInfo(
        this.req,
      ).getUserRemoteInfo();

      const newTicket = new TicketModel({
        ...ticket,
        userRemoteInfo: userRemoteInfo,
      });
      const ticketValidation = newTicket.validateSync();

      if (ticketValidation) statusCode = 400;

      if (!ticketValidation) {
        const filter = userRemoteInfo.xForwardedFor
          ? {
              'userRemoteInfo.xForwardedFor': userRemoteInfo.xForwardedFor,
            }
          : {'userRemoteInfo.socket': userRemoteInfo.socket};
        tickets = BRANCH ? [true] : await getTicketsByIP(filter);

        if (tickets.length >= 2) statusCode = 429;
      }

      if (statusCode === 200) {
        await createTicket(<ITicket>{
          ...ticket,
          userRemoteInfo: userRemoteInfo,
        });
      } else {
        const message: string | undefined = ticketValidation?.message;
        new CustomError('createTicket-controller', message, statusCode);
      }

      return {
        statusCode: statusCode,
        headers: Object.assign({}, this.req.headers),
      };
    } catch (error) {
      new CustomError('createTicket-controller', error?.message, statusCode);
      return {
        statusCode: 500,
        headers: Object.assign({}, this.req.headers),
      };
    }
  }
}
