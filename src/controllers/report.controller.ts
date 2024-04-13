import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import reportService from '../services/report.service.js';

import reportRepository from '../repositories/report.repository.js';

import { IModifyAuthRequest } from '../types/basic.types.js';

class ReportController {
  async addReport(req: IModifyAuthRequest, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        res.status(400).json({
          message: 'Data is not correct',
          errors: errors.array(),
        });

      const {
        userID,
        body: { eventDescription, date },
      } = req;
      let reportID: undefined | number = req.body.reportID;

      const allReportIDs: number[] = await reportRepository.getAllIDs();

      if (reportID && allReportIDs.includes(reportID))
        res.status(400).json({
          message: 'reportID is not correct',
        });
      if (!reportID) reportID = reportService.generateReportID(allReportIDs);

      const newReport = {
        reportID,
        eventDescription,
        date,
        userInitiatorID: userID,
      };

      await reportRepository.create(newReport);

      res.status(201).send(newReport);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getReportsByUserId(req: IModifyAuthRequest, res: Response) {
    try {
      const { userID } = req;

      const reports = await reportRepository.findByUserID(userID);

      res.send(reports);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteReportsByIds(req: Request, res: Response) {
    try {
      // i13v13er0|i13v13er0|i13v13er0
      const IDs = `${req.query.ids}`;

      const IDsArr: number[] = IDs.split('|').map((id) => Number(id));

      await reportRepository.deleteByIDs(IDsArr);

      res.status(204).send('Reports has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteAllReports(req: Request, res: Response) {
    try {
      await reportRepository.deleteAll();

      res.status(204).send('Reports has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new ReportController();
