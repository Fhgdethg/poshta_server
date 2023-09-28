import { Request, Response } from 'express';

class ProductController {
  async addProduct(req: Request, res: Response) {
    try {
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getProductByID(req: Request, res: Response) {
    try {
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new ProductController();
