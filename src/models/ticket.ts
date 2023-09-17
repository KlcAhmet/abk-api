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
    ip: {
      type: String,
      required: true,
    },
  },
  {timestamps: true, strict: true, strictQuery: true},
);

export const ticketSchema = new Schema<ITicket>(
  {
    name: {type: String, required: true},
    mail: {type: String, required: true},
    message: {type: String, required: true},
    userRemoteInfo: userInfoSchema,
  },
  {timestamps: true, strict: true, strictQuery: true},
);

export const TicketModel = model<ITicket>(
  'abk-frontend',
  ticketSchema,
  'tickets-dev',
);
