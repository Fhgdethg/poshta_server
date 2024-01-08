import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mqtt from 'mqtt';

import productService from '../services/product.service.js';

import productRepository from '../repositories/product.repository.js';
import shelveRepository from '../repositories/shelve.repository.js';

import { IProduct } from '../types/product.types.js';
import { IShelve } from '../types/shelve.types.js';

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

      const savedShelve: IShelve | null | any = await shelveRepository.findOne<{
        shelveID: number;
      }>({
        shelveID,
      });

      if (!savedShelve?.shelveID)
        return res
          .status(404)
          .json({ message: `Shelve with id ${shelveID} is not exist` });

      const newProduct = await productRepository.create({
        productID,
        productDimensions: { width, height, length },
        shelveID,
      });

      await productService.addProductOnShelve(shelveID, productID);

      res.send(newProduct);
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
        return res.status(404).json({
          message: `Product with id = ${id} is not exist`,
          isProductNotExist: true,
        });

      return res.send(product);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getProductByIDSimulation(req: Request, res: Response) {
    try {
      const {
        body: { x, y },
        params: { id },
      } = req;

      const mqttBody = JSON.stringify({ x, y, id });
      const mqttUrl = 'mqtt://mqtt.eclipse.org';
      const client = mqtt.connect(mqttUrl);

      client.on('error', ({ message }) => {
        return res.status(500).json({ message });
      });

      let resMessage: any = '';

      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe('mytopic');
        client.publish('mytopic', mqttBody);
      });

      client.on('message', (topic, message) => {
        resMessage = message.toString('utf-8');
        client.end();
      });

      client.on('close', () => {
        console.log('Disconnected from MQTT broker');
        return res.send(resMessage);
      });
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

      const productID = Number(req.params.id);
      const { body } = req;

      const product = await productRepository.findOne<{ productID: number }>({
        productID,
      });

      const isAnotherShelve =
        body?.shelveID && product && product?.shelveID !== body?.shelveID;

      if (isAnotherShelve) {
        await productService.deleteProductWithShelve(
          product.shelveID,
          productID,
        );

        await productService.addProductOnShelve(
          body.shelveID,
          body?.productID ? body.productID : productID,
        );
      }

      const repositoryBody = productService.getUpdateRepositoryBody(body);

      await productRepository.updateByFields(productID, repositoryBody);

      return res.send();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const productID = Number(req.params.id);

      const product = await productRepository.findOne<{ productID: number }>({
        productID,
      });

      if (!product?.shelveID)
        return res
          .status(404)
          .json({ message: `Product with id ${productID} is not exist` });

      const productDeleteResult = await productRepository.deleteByID(productID);

      if (!productDeleteResult.deletedCount)
        return res.status(404).json({ message: `Product deletion error` });

      await productService.deleteProductWithShelve(product.shelveID, productID);

      return res.send(productDeleteResult);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new ProductController();
