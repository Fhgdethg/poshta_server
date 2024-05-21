import ChatMessage from '../models/ChatMessage.js';

import { IChatMessage } from '../types/chatMessage.types.js';

class ChatMessageRepository {
  async create(msg: IChatMessage) {
    return await ChatMessage.create(msg);
  }

  async findAll() {
    return await ChatMessage.find({});
  }
}
export default new ChatMessageRepository();
