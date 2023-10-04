import shelveRepository from '../repositories/shelve.repository.js';

import { IUpdateShelveBody } from '../types/shelve.types.js';

class ShelveService {
  async getShelvesIDs() {
    try {
      const shelves = await shelveRepository.findAll();
      return shelves ? shelves.map((user) => user.shelveID) : [];
    } catch (err) {
      throw new Error('Getting shelves IDs error');
    }
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
