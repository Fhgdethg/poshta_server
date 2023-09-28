import { Types } from 'mongoose';

import { IDimensions, ICoordinates } from './basic.types.js';

export interface IShelve {
  shelveID: number;
  shelveDimensions: IDimensions;
  coordinates: ICoordinates;
  products: number[];
  users: Types.ObjectId[];
}

export interface IShelveExtremes {
  maxY: number;
  maxX: number;
}

export interface IUpdateShelveBody {
  shelveID?: number;
  width?: number;
  height?: number;
  length?: number;
}
