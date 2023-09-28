import { IUpdateShelveBody } from '../types/shelve.types.js';

class ShelveService {
  checkIsUpdatingBodyValid(body: IUpdateShelveBody) {
    const allowedFields = ['shelveID', 'width', 'height', 'length'];
    const receivedFields = Object.keys(body);

    if (!receivedFields.length) {
      throw new Error(`Request body is empty`);
    }

    const isValid = receivedFields.every((field) =>
      allowedFields.includes(field),
    );

    if (!isValid) {
      throw new Error(
        `Request body must include only ${allowedFields.join(', ')} fields`,
      );
    }

    return true;
  }
}

export default new ShelveService();
