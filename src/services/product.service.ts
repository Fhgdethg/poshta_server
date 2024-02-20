import shelveRepository from '../repositories/shelve.repository.js';

import shelveService from './shelve.service.js';

class ProductService {
  // getUpdateRepositoryBody(body: IUpdateProductBody) {
  //   const { shelveID, productID, width, height, length } = body;
  //   const repositoryBody: any = {};
  //
  //   if (shelveID) repositoryBody.shelveID = shelveID;
  //   if (productID) repositoryBody.productID = productID;
  //   if (width) repositoryBody['productDimensions.width'] = width;
  //   if (height) repositoryBody['productDimensions.height'] = height;
  //   if (length) repositoryBody['productDimensions.length'] = length;
  //
  //   return repositoryBody;
  // }

  async addProductOnShelve(
    shelveID: number,
    productID: number,
    productWidth: number,
    productHeight: number,
    productLength: number,
  ) {
    try {
      const updatedShelve = await shelveRepository.findOne<{
        shelveID: number;
      }>({
        shelveID,
      });

      if (updatedShelve) {
        const { products } = updatedShelve;

        products.push(productID);

        const percentBusyVolume = shelveService.getNewPercentBusyVolume(
          updatedShelve.percentBusyVolume,
          updatedShelve.shelveDimensions.width,
          updatedShelve.shelveDimensions.height,
          updatedShelve.shelveDimensions.length,
          productWidth,
          productHeight,
          productLength,
          'add',
        );

        await shelveRepository.updateByFields(shelveID, {
          products,
          percentBusyVolume,
        });
      }
    } catch (err) {
      throw new Error('Adding product on shelve error');
    }
  }

  async deleteProductWithShelve(
    shelveID: number,
    productID: number,
    productWidth: number,
    productHeight: number,
    productLength: number,
  ) {
    try {
      const updatedShelve = await shelveRepository.findOne<{
        shelveID: number;
      }>({
        shelveID,
      });

      if (updatedShelve) {
        const { products } = updatedShelve;
        const productPosition = products.indexOf(productID);

        products.splice(productPosition, 1);

        const percentBusyVolume = shelveService.getNewPercentBusyVolume(
          updatedShelve.percentBusyVolume,
          updatedShelve.shelveDimensions.width,
          updatedShelve.shelveDimensions.height,
          updatedShelve.shelveDimensions.length,
          productWidth,
          productHeight,
          productLength,
          'remove',
        );

        await shelveRepository.updateByFields(shelveID, {
          products,
          percentBusyVolume,
        });
      }
    } catch (err) {
      throw new Error('Deleting product with shelve error');
    }
  }
}

export default new ProductService();
