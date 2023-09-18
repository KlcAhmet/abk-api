import {inject} from '@loopback/core';
import {Request, RestBindings} from '@loopback/rest';
import {IUserInfo} from '../models';

export class CollectUsersInfo {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  getUserRemoteInfo(): IUserInfo {
    return {
      socket: this.req?.socket?.remoteAddress,
      cfConnectingIp: this.req.headers['cf-connecting-ip']
        ? this.req.headers['cf-connecting-ip'].toString()
        : undefined,
      xForwardedFor: this.req.headers['x-forwarded-for']
        ? this.req.headers['x-forwarded-for'].toString()
        : undefined,
    };
  }

  /*collectUsersInfo() {
    return {
      ip: getIp() ,
      browser: this.req.headers['user-agent'],
      language: this.req.headers['accept-language'],
      referrer: this.req.headers['referer'],
      url: this.req.url,
      method: this.req.method,
    };
  }*/
}
