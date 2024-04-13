import { Types } from 'mongoose';

import Report from '../models/Report.js';

import { IReport } from '../types/report.types.js';

class ReportRepository {
  async findByUserID(userID: Types.ObjectId) {
    return await Report.find({ userInitiatorID: userID });
  }

  async getAllIDs() {
    return await Report.distinct('reportID');
  }

  async create(reportPayload: IReport) {
    return await Report.create(reportPayload);
  }

  async deleteByIDs(reportIDs: number[]) {
    return await Report.deleteMany({ reportID: { $in: reportIDs } });
  }

  async deleteAll() {
    return await Report.deleteMany();
  }
}
export default new ReportRepository();
