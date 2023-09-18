import {inject} from '@loopback/core';
import {Request, RestBindings} from '@loopback/rest';

export class CollectUsersInfo {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  getUserRemoteInfo() {
    const ip =
      this.req?.socket?.remoteAddress ??
      this.req.headers['x-forwarded-for'] ??
      this.req.headers['cf-connecting-ip'];

    return {
      ip: ip,
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