import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRouter from './routers/auth.router.js';
import shelveRouter from './routers/shelve.router.js';
import productRouter from './routers/product.router.js';

import { routes } from './constants/routes.js';

import corsMiddleware from './middlewares/cors.middleware.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 6000;

app.use(corsMiddleware);
app.use(express.json());
app.use(`${routes.api}${routes.auth}`, authRouter);
app.use(routes.api, shelveRouter);
app.use(routes.api, productRouter);

const start = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
