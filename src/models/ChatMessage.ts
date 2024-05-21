import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ChatMessage = new Schema({
  authorEmail: { type: String, required: true },
  message: { type: String, required: true },
});

export default model('ChatMessage', ChatMessage);
