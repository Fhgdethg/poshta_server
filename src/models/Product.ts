import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const Product = new Schema({
  productID: { type: Number, required: true, unique: true },
  productTitle: { type: String, required: false },
  productDescription: { type: String, required: false },
  productImgUrl: { type: String, required: false },
  productDimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    length: { type: Number, required: true },
  },
  shelveID: { type: Number, ref: 'Shelve' },
});

export default model('Product', Product);
