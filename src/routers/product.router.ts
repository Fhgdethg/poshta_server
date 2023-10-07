import { Router } from 'express';
import { body, check } from 'express-validator';

import { routes } from '../constants/routes.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import productController from '../controllers/product.controller.js';

import { checkIsUpdatingBodyValid } from '../helpers/validation.helpers.js';

const router = Router();

const productWithID = `${routes.products}${routes.qID}`;
const productWithIDSimulation = `${productWithID}${routes.simulation}`;
const allowedFields = ['shelveID', 'width', 'height', 'length', 'productID'];

router.post(
  routes.products,
  [
    check('productID', 'productID is not number').isNumeric(),
    check('shelveID', 'shelveID is not number').isNumeric(),
    check('width', 'width is not number').isNumeric(),
    check('height', 'height is not number').isNumeric(),
    check('length', 'length is not number').isNumeric(),
  ],
  authMiddleware,
  productController.addProduct,
);

router.get(routes.products, authMiddleware, productController.getAllProducts);
router.get(productWithID, authMiddleware, productController.getProductByID);
router.get(
  productWithIDSimulation,
  authMiddleware,
  productController.getProductByIDSimulation,
);

router.patch(
  productWithID,
  [
    body().custom((value, { req }) =>
      checkIsUpdatingBodyValid(req.body, allowedFields),
    ),
    check('shelveID', 'shelveID is not number').optional().isNumeric(),
    check('productID', 'productID is not number').optional().isNumeric(),
    check('width', 'width is not number').optional().isNumeric(),
    check('height', 'height is not number').optional().isNumeric(),
    check('length', 'length is not number').optional().isNumeric(),
  ],
  authMiddleware,
  productController.updateProduct,
);

router.delete(productWithID, authMiddleware, productController.deleteProduct);

export default router;
