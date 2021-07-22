const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');
const StoreRef = require('./storeRef.model');

const processorSchema = mongoose.Schema(
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
    integrated_graphics: {
      type: String,
      trim: true,
    },
    cores: {
      type: Number,
      required: true,
    },
    tdp: {
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
    multithreading: {
      type: Boolean,
      required: true,
    },
    stores: { type: [StoreRef.schema], required: false, default: [] },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
processorSchema.plugin(toJSON);
processorSchema.plugin(paginate);

/**
 * @typedef Processor
 */
const Processor = mongoose.model('Processor', processorSchema);

module.exports = Processor;
