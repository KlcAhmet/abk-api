import {ITicket, TicketModel} from '../models';
import {CustomError} from '../mixins';

export async function createTicket(ticket: ITicket): Promise<object> {
  try {
    const newTicket = new TicketModel(ticket);
    return await newTicket.save();
  } catch (error) {
    new CustomError('createTicket-repository', error?.message);
    throw new Error(error);
  }
}
