const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const Store = require('./store.model');
const { toJSON, paginate } = require('./plugins');

const storeRefSchema = mongoose.Schema(
  {
    link_prod: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    stock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

storeRefSchema.plugin(toJSON);
storeRefSchema.plugin(paginate);

/**
 * @typedef StoreRef
 */
const StoreRef = mongoose.model('StoreRef', storeRefSchema);

module.exports = StoreRef;
