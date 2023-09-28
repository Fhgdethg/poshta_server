import Shelve from '../models/Shelve.js';

import { IShelve, IUpdateShelveBody } from '../types/shelve.types.js';

class ShelveRepository {
  async findOne<T extends Object>(expression: T) {
    return await Shelve.findOne(expression);
  }

  async findExtremesByExtremumField<T extends Object>(expression: T) {
    return await Shelve.aggregate([
      {
        $group: {
          _id: null,
          ...expression,
        },
      },
    ]);
  }

  async create(expression: IShelve) {
    return await Shelve.create(expression);
  }

  async getAll() {
    return await Shelve.find({});
  }

  async getByID(shelveID: number) {
    return await Shelve.findOne({ shelveID });
  }

  async deleteByID(shelveID: number) {
    return await Shelve.deleteOne({ shelveID });
  }

  async findAllIDs() {
    const shelve = await Shelve.find({}, 'shelveID');
    return shelve ? shelve.map((user) => user.shelveID) : [];
  }

  async updateByFields(shelveID: number, body: IUpdateShelveBody) {
    return await Shelve.updateOne(
      { shelveID },
      {
        $set: body,
      },
    );
  }
}
export default new ShelveRepository();
