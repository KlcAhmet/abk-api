import {ITicket, TicketModel} from '../models';

export async function createTicket(ticket: ITicket): Promise<object> {
  try {
    const newTicket = new TicketModel(ticket);
    return await newTicket.save();
  } catch (error) {
    throw new Error(error);
  }
}
