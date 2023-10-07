import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const SECRET_KEY = `${process.env.SECRET_KEY}`;

class AuthService {
  getToken(_id: Types.ObjectId) {
    return jwt.sign({ _id }, SECRET_KEY, { expiresIn: '1h' });
  }
}

export default new AuthService();
