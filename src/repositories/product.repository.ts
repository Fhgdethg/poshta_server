import Product from '../models/Product.js';

import { IProduct } from '../types/product.types.js';

class ProductRepository {
  async findOne<T extends Object>(expression: T) {
    return await Product.findOne(expression);
  }

  async create(expression: IProduct) {
    return await Product.create(expression);
  }

  async findAll() {
    return await Product.find({});
  }

  async updateByFields(productID: number, body: any) {
    return await Product.updateOne(
      { productID },
      {
        $set: body,
      },
    );
  }

  async deleteByID(productID: number) {
    return await Product.deleteOne({ productID });
  }
}
export default new ProductRepository();
