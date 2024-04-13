import { Types } from 'mongoose';

export interface IReport {
  reportID: number;
  eventDescription: string;
  date: string;
  userInitiatorID: Types.ObjectId;
}
