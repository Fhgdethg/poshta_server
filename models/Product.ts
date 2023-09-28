import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const Product = new Schema({
  productID: { type: Number, required: true, unique: true },
  productDimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    length: { type: Number, required: true },
  },
  products: [{ type: Number, ref: 'Shelve' }],
});

export default model('Product', Product);
