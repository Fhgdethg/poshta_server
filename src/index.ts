import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import emptyRouter from './routers/empty.router.js';
import authRouter from './routers/auth.router.js';
import shelveRouter from './routers/shelve.router.js';
import productRouter from './routers/product.router.js';
import reportRouter from './routers/report.router.js';
import chatMessageRouter from './routers/chatMessage.router.js';

import { routes } from './constants/routes.js';
import { Server } from 'socket.io';

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
app.use(routes.root, emptyRouter);
app.use(`${routes.api}${routes.auth}`, authRouter);
app.use(routes.api, shelveRouter);
app.use(routes.api, productRouter);
app.use(routes.api, reportRouter);

const start = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);

    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

    const chatServer = new Server(server, {
      cors: {
        origin: CLIENT_URLS,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    chatMessageRouter(chatServer);
  } catch (err) {
    console.log(err);
  }
};

start();
