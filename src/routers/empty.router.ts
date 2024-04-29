import { Router } from 'express';

import emptyController from '../controllers/empty.controller.js';

import { routes } from '../constants/routes.js';

const router = Router();

router.get(routes.root, emptyController.rootHandler);

export default router;
