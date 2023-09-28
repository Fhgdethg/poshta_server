import User from '../models/User.js';

class UserRepository {
  async findOne<T extends Object>(expression: T) {
    return await User.findOne(expression);
  }

  async findAllIDs() {
    const users = await User.find({}, '_id');
    return users ? users.map((user) => user._id) : [];
  }
}

export default new UserRepository();
