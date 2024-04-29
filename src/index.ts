import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './routers/auth.router.js';
import shelveRouter from './routers/shelve.router.js';
import productRouter from './routers/product.router.js';
import reportRouter from './routers/report.router.js';

import { routes } from './constants/routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 6000;

const CLIENT_URLS = `${process.env.CLIENT_URLS}`.split('|');

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URLS,
    credentials: true,
  }),
);
app.use(`${routes.api}${routes.auth}`, authRouter);
app.use(routes.api, shelveRouter);
app.use(routes.api, productRouter);
app.use(routes.api, reportRouter);

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
