import { IDimensions, ICoordinates } from './basic.types';

export interface IShelve {
  shelveID: number;
  shelveDimensions: IDimensions;
  coordinates: ICoordinates;
  products: number[];
  percentBusyVolume: number;
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
  products?: number[];
  percentBusyVolume?: number;
}
