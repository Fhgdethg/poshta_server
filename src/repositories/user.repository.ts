import User from '../models/User.js';

class UserRepository {
  async findOne<T extends Object>(expression: T) {
    return await User.findOne(expression);
  }
}

export default new UserRepository();
