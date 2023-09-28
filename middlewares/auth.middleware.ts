import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { IModifyAuthRequest } from '../types/basic.types.js';

const SECRET_KEY = `${process.env.SECRET_KEY}`;

const authMiddleware = (
  req: IModifyAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Auth error' });
    }

    const user: any = jwt.verify(token, SECRET_KEY);
    req.userID = user._id;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Auth error' });
  }
};

export default authMiddleware;
