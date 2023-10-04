import { IUpdateProductBody } from '../types/product.types.js';

class ProductService {
  getUpdateRepositoryBody(body: IUpdateProductBody) {
    const { shelveID, productID, width, height, length } = body;
    const repositoryBody: any = {};

    if (shelveID) repositoryBody.shelveID = shelveID;
    if (productID) repositoryBody.productID = productID;
    if (width) repositoryBody['productDimensions.width'] = width;
    if (height) repositoryBody['productDimensions.height'] = height;
    if (length) repositoryBody['productDimensions.length'] = length;

    return repositoryBody;
  }
}

export default new ProductService();
