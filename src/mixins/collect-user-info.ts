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
      cfRay: this.req.headers['cf-ray']
        ? this.req.headers['cf-ray'].toString()
        : undefined,
      secChUa: this.req.headers['sec-ch-ua']
        ? this.req.headers['sec-ch-ua'].toString()
        : undefined,
      secChUaMobile: this.req.headers['sec-ch-ua-mobile']
        ? this.req.headers['sec-ch-ua-mobile'].toString()
        : undefined,
      secChUaPlatform: this.req.headers['sec-ch-ua-platform']
        ? this.req.headers['sec-ch-ua-platform'].toString()
        : undefined,
      userAgent: this.req.headers['user-agent'],
      cfIpCountry: this.req.headers['cf-ipcountry']
        ? this.req.headers['cf-ipcountry'].toString()
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
