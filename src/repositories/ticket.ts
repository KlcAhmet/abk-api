import {ITicket, TicketModel} from '../models';
import {CustomError} from '../mixins';

export async function createTicket(ticket: ITicket): Promise<ITicket> {
  try {
    const newTicket = new TicketModel(ticket);
    return await newTicket.save();
  } catch (error) {
    new CustomError('createTicket-repository', error?.message);
    throw new Error(error);
  }
}

export async function getTicket(filter: {}): Promise<Object[]> {
  try {
    return await TicketModel.find(filter);
    // return  await TicketModel.find({ name: 'john', age: { $gte: 18 } }).exec();
  } catch (error) {
    new CustomError('createTicket-repository', error?.message);
    throw new Error(error);
  }
}
