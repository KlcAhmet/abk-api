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
    console.log('ping', this.req.socket.remoteAddress); // bu headers geleck
    const ip =
      this.req.socket.remoteAddress ??
      this.req.headers['x-forwarded-for'] ??
      this.req.headers['cf-connecting-ip'];

    const pp = process.env.PP;

    return {
      greeting1: 'Hello from LoopBack test6',
      ip: ip,
      pp: pp,
      greeting5: 'develop active',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
