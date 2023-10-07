import { IDimensions } from './basic.types';

export interface IProduct {
  productID: number;
  productDimensions: IDimensions;
  shelveID: number;
}

export interface IUpdateProductBody {
  shelveID?: number;
  productID?: number;
  width?: number;
  height?: number;
  length?: number;
}
