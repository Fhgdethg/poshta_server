import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import productService from '../services/product.service.js';

import productRepository from '../repositories/product.repository.js';

import { IProduct } from '../types/product.types';

class ProductController {
  async addProduct(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        res.status(400).json({
          message: 'Data is not correct',
          errors: errors.array(),
        });

      const { productID, width, height, length, shelveID } = req.body;

      const savedProduct: IProduct | null | any =
        await productRepository.findOne<{
          productID: number;
        }>({
          productID,
        });

      if (savedProduct?.productID)
        return res
          .status(404)
          .json({ message: `Product with id ${productID} is already exist` });

      const newShelve = await productRepository.create({
        productID,
        productDimensions: { width, height, length },
        shelveID,
      });

      res.send(newShelve);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const allProducts = await productRepository.findAll();

      return res.send(allProducts);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getProductByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productRepository.findOne<{ productID: number }>({
        productID: Number(id),
      });

      if (!product)
        return res
          .status(404)
          .json({ message: `Product with id = ${id} is not exist` });

      return res.send(product);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        res.status(400).json({
          message: 'Data is not correct',
          errors: errors.array(),
        });

      const { id } = req.params;
      const { body } = req;

      const repositoryBody = productService.getUpdateRepositoryBody(body);

      await productRepository.updateByFields(Number(id), repositoryBody);

      return res.send();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const productDeleteResult = await productRepository.deleteByID(
        Number(id),
      );

      if (!productDeleteResult.deletedCount)
        return res
          .status(404)
          .json({ message: `Product with id ${id} is not exist` });

      return res.send(productDeleteResult);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new ProductController();
