import { Router } from 'express';
import { check } from 'express-validator';

import { routes } from '../constants/routes.js';

import authMiddleware from '../middlewares/auth.middleware.js';

import reportController from '../controllers/report.controller.js';

const router = Router();

const reportByUserID = `${routes.reports}${routes.byUserID}`;

router.post(
  routes.reports,
  [
    check('reportID', 'reportID is not number').optional().isNumeric(),
    check('eventDescription', 'eventDescription is not string').isString(),
    // 11.04.2024 14:51:21
    check('date', 'Date format is not correct')
      .isString()
      .matches(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}$/),
  ],
  authMiddleware,
  reportController.addReport,
);

router.get(reportByUserID, authMiddleware, reportController.getReportsByUserId);

router.delete(
  `${routes.reports}${routes.byIDs}`,
  authMiddleware,
  reportController.deleteReportsByIds,
);
router.delete(
  routes.reports,
  authMiddleware,
  reportController.deleteAllReports,
);

export default router;
