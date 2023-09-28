import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  shelves: [{ type: Number, ref: 'Shelve' }],
});

export default model('User', User);
