import mongoose, { Types } from 'mongoose';

const { Schema, model } = mongoose;

const Report = new Schema({
  reportID: { type: Number, required: true, unique: true },
  eventDescription: { type: String, required: true },
  date: { type: String, required: true },
  userInitiatorID: { type: Types.ObjectId, required: true, ref: 'User' },
});

export default model('Report', Report);
