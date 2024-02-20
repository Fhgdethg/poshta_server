import shelveRepository from '../repositories/shelve.repository.js';

import { IShelveExtremes, IUpdateShelveBody } from '../types/shelve.types.js';

class ShelveService {
  async getNewCoordinates(maxShelvesCount: number) {
    try {
      const shelveExtremes: IShelveExtremes[] =
        await shelveRepository.findExtremesByExtremumField({
          maxY: { $max: '$coordinates.y' },
          maxX: { $max: '$coordinates.x' },
        });

      const maxY = shelveExtremes?.[0]?.maxY;
      const maxX = shelveExtremes?.[0]?.maxX;

      const optimizedY = maxY || 1;
      const optimizedX = maxX || 0;

      const isExtremumFindSuccess = Boolean(maxY && maxX);

      const newX =
        isExtremumFindSuccess && optimizedX >= maxShelvesCount
          ? 1
          : optimizedX + 1;
      const newY =
        isExtremumFindSuccess && optimizedX >= maxShelvesCount
          ? optimizedY + 1
          : optimizedY;

      return { newX, newY };
    } catch (err) {
      throw new Error('Getting extremes error');
    }
  }

  async getShelvesIDs() {
    try {
      const shelves = await shelveRepository.findAll();
      return shelves ? shelves.map((user) => user.shelveID) : [];
    } catch (err) {
      throw new Error('Getting shelves IDs error');
    }
  }

  getNewPercentBusyVolume(
    oldPercentBusyVolume: number,
    shelveWidth: number,
    shelveHeight: number,
    shelveLength: number,
    productWidth: number,
    productHeight: number,
    productLength: number,
    productAction: 'add' | 'remove',
  ) {
    const shelveVolume = shelveWidth * shelveHeight * shelveLength;
    const productVolume = productWidth * productHeight * productLength;

    const productBusyPlace = (productVolume * 100) / shelveVolume;

    if (productAction === 'add') return oldPercentBusyVolume + productBusyPlace;
    else return oldPercentBusyVolume - productBusyPlace;
  }

  getIsProductFit(
    shelveWidth: number,
    shelveHeight: number,
    shelveLength: number,
    shelvePercentBusyVolume: number,
    productWidth: number,
    productHeight: number,
    productLength: number,
  ) {
    const shelveVolume = shelveWidth * shelveHeight * shelveLength;
    const busyVolume = (shelvePercentBusyVolume * 100) / shelveVolume;
    const emptyVolume = shelveVolume - busyVolume;
    const productVolume = productWidth * productHeight * productLength;

    return emptyVolume >= productVolume;
  }

  getUpdateRepositoryBody(body: IUpdateShelveBody) {
    const { shelveID, width, height, length } = body;
    const repositoryBody: any = {};

    if (shelveID) repositoryBody.shelveID = shelveID;
    if (width) repositoryBody['shelveDimensions.width'] = width;
    if (height) repositoryBody['shelveDimensions.height'] = height;
    if (length) repositoryBody['shelveDimensions.length'] = length;

    return repositoryBody;
  }
}

export default new ShelveService();
