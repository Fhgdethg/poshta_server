import { Request } from 'express';
import { Types } from 'mongoose';

export interface IModifyAuthRequest extends Request {
  userID?: Types.ObjectId;
}

export interface IDimensions {
  width: number;
  height: number;
  length: number;
}

export interface ICoordinates {
  x: number;
  y: number;
}
