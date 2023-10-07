import { Router } from 'express';
import { body, check } from 'express-validator';

import shelveController from '../controllers/shelve.controller.js';

import { routes } from '../constants/routes.js';

import authMiddleware from '../middlewares/auth.middleware.js';

import { checkIsUpdatingBodyValid } from '../helpers/validation.helpers.js';

const router = Router();

const shelveWithID = `${routes.shelves}${routes.qID}`;
const allowedFields = ['shelveID', 'width', 'height', 'length'];

router.post(
  routes.shelves,
  [
    check('shelveID', 'shelveID is not number').isNumeric(),
    check('width', 'width is not number').isNumeric(),
    check('height', 'height is not number').isNumeric(),
    check('length', 'length is not number').isNumeric(),
    check('maxShelvesCount', 'maxShelvesCount is not number').isNumeric(),
  ],
  authMiddleware,
  shelveController.addShelve,
);

router.get(routes.shelves, authMiddleware, shelveController.getAllShelves);
router.get(
  `${routes.shelves}${routes.allIDs}`,
  authMiddleware,
  shelveController.getAllShelvesIDs,
);
router.get(shelveWithID, authMiddleware, shelveController.getShelveByID);

router.patch(
  shelveWithID,
  [
    body().custom((value, { req }) =>
      checkIsUpdatingBodyValid(req.body, allowedFields),
    ),
    check('shelveID', 'shelveID is not number').optional().isNumeric(),
    check('width', 'width is not number').optional().isNumeric(),
    check('height', 'height is not number').optional().isNumeric(),
    check('length', 'length is not number').optional().isNumeric(),
  ],
  authMiddleware,
  shelveController.updateShelveFields,
);

router.delete(shelveWithID, authMiddleware, shelveController.deleteShelve);

export default router;
