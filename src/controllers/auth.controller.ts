import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import authService from '../services/auth.service.js';

import userRepository from '../repositories/user.repository.js';

import { IModifyAuthRequest } from '../types/basic.types.js';
import { Types } from 'mongoose';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      const { email, password } = req.body;

      if (!errors.isEmpty())
        res.status(400).json({
          message: 'Login data is not correct',
          errors: errors.array(),
        });

      const user = await userRepository.findOne<{ email: string }>({ email });

      if (!user)
        return res.status(400).json({ message: 'User does not exist' });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res
          .status(400)
          .json({ message: 'Email or password is not correct' });

      const token = authService.getToken(user._id);

      res.cookie('authToken', token, { httpOnly: true });
      return res.send({ token, user });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async auth(req: IModifyAuthRequest, res: Response) {
    try {
      const { userID } = req;

      if (!userID) return res.status(400).send('Session was ended');

      const user = await userRepository.findOne<{ _id: Types.ObjectId }>({
        _id: userID,
      });

      if (!user) return res.status(404).send('User was not founded');

      return res.send(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new AuthController();
