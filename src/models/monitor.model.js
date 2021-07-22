const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const StoreRef = require('./storeRef.model');

const monitorSchema = mongoose.Schema(
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
    size: {
      type: Number,
      required: true,
      trim: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    refresh_rate: {
      type: Number,
    },
    response_time: {
      type: Number,
    },
    panel_type: {
      type: String,
    },
    aspect_ratio: {
      type: String,
    },
    resolution: {
      type: String,
    },
    stores: [StoreRef.schema],
  },
  {
    timestamps: true,
  }
);

monitorSchema.plugin(toJSON);
monitorSchema.plugin(paginate);

/**
 * @typedef Monitor
 */
const Monitor = mongoose.model('Monitor', monitorSchema);

module.exports = Monitor;
