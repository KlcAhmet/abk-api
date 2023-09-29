import {inject} from '@loopback/core';
import {Request, RestBindings} from '@loopback/rest';
import {IUserInfo} from '../models';

export class CollectUsersInfo {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  getUserRemoteInfo(): IUserInfo {
    return {
      cfConnectingIp: this.req.headers['cf-connecting-ip']?.toString(),
      cfIpCountry: this.req.headers['cf-ipcountry']?.toString(),
      cfRay: this.req.headers['cf-ray']?.toString(),
      secChUa: this.req.headers['sec-ch-ua']?.toString(),
      secChUaMobile: this.req.headers['sec-ch-ua-mobile']?.toString(),
      secChUaPlatform: this.req.headers['sec-ch-ua-platform']?.toString(),
      socket: this.req.socket?.remoteAddress?.toString(),
      userAgent: this.req.headers['user-agent']?.toString(),
      xForwardedFor: this.req.headers['x-forwarded-for']?.toString(),
    };
  }
}
