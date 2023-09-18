import { inject } from '@loopback/core';
import { get, Request, response, ResponseObject, RestBindings } from '@loopback/rest';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
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
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    const ip =
      this.req.socket.remoteAddress ??
      this.req.headers['x-forwarded-for'] ??
      this.req.headers['cf-connecting-ip'];

    return {
      greeting:
        'Hello welcome to my api. Please dont use it for bad things. Thanks. Have a nice day. :)',
      tt: 'tt',
      ip: ip,
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
