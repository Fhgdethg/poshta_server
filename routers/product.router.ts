import { Router } from 'express';
import { body, check } from 'express-validator';

import shelveController from '../controllers/shelve.controller.js';

import shelveService from '../services/shelve.service.js';

import { routes } from '../constants/routes.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import productController from '../controllers/product.controller.js';

const router = Router();

const productWithID = `${routes.products}${routes.qID}`;

router.post(routes.products, authMiddleware, productController.addProduct);

router.get(routes.products, authMiddleware, productController.getAllProducts);
router.get(productWithID, authMiddleware, productController.getProductByID);

router.put(productWithID, authMiddleware, productController.updateProduct);

router.delete(productWithID, authMiddleware, productController.deleteProduct);

export default router;
