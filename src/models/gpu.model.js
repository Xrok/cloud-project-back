const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const StoreRef = require('./storeRef.model');

const gpuSchema = mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    chipset: {
      type: String,
      required: true,
      trim: true,
    },
    vram: {
      type: Number,
      required: true,
    },
    base_clock: {
      type: Number,
      required: true,
    },
    boost_clock: {
      type: Number,
    },
    color: {
      type: String,
      trim: true,
    },
    length: {
      type: Number,
    },
    stores: [StoreRef.schema],
  },
  {
    timestamps: true,
  }
);

gpuSchema.plugin(toJSON);
gpuSchema.plugin(paginate);

/**
 * @typedef Gpu
 */
const Gpu = mongoose.model('Gpu', gpuSchema);

module.exports = Gpu;
