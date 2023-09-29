import {model, Schema} from 'mongoose';
import {IUserInfo} from './';

export type ITicket = {
  name: string;
  mail: string;
  message: string;
  userRemoteInfo: IUserInfo;
};

const userInfoSchema = new Schema<IUserInfo>(
  {
    cfConnectingIp: {
      type: String || undefined,
    },
    cfIpCountry: {
      type: String || undefined,
    },
    cfRay: {
      type: String || undefined,
    },
    secChUa: {
      type: String || undefined,
    },
    secChUaMobile: {
      type: String || undefined,
    },
    secChUaPlatform: {
      type: String || undefined,
    },
    socket: {
      type: String || undefined,
    },
    userAgent: {
      type: String || undefined,
    },
    xForwardedFor: {
      type: String || undefined,
    },
  },
  {timestamps: true, strict: true, strictQuery: true},
);

export const ticketSchema = new Schema<ITicket>(
  {
    name: {
      type: String,
      required: true,
      min: 1,
      max: 100,
    },
    mail: {
      type: String,
      required: true,
      min: 5,
      max: 100,
      validate: {
        validator: (val: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        },
        message: props => `${props.value} is not a valid mail!`,
      },
    },
    message: {
      type: String,
      required: true,
      min: 5,
      max: 1000,
    },
    userRemoteInfo: userInfoSchema,
  },
  {timestamps: true, strict: true, strictQuery: true},
);

export const TicketModel = model<ITicket>(
  'abk-frontend',
  ticketSchema,
  process.env.BRANCH === 'main' ? 'ticket' : 'ticket-dev',
);
