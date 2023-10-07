import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const Shelve = new Schema({
  shelveID: { type: Number, required: true, unique: true },
  shelveDimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    length: { type: Number, required: true },
  },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  products: [{ type: Number, ref: 'Product' }],
});

export default model('Shelve', Shelve);
