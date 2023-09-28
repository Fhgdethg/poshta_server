import { Router } from 'express';
import { check } from 'express-validator';

import authController from '../controllers/auth.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';

import { routes } from '../constants/routes.js';

const router = Router();

router.post(
  routes.login,
  [
    check('email', 'Email is not correct').trim().isEmail(),
    check('password', 'Password is not correct').trim().notEmpty().isLength({
      min: 8,
      max: 10,
    }),
  ],
  authController.login,
);

router.get(routes.auth, authMiddleware, authController.auth);

export default router;
