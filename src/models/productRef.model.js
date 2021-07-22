const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const productRefSchema = mongoose.Schema(
  {
    prod_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    _id: false,
  }
);

productRefSchema.plugin(toJSON);
productRefSchema.plugin(paginate);

/**
 * @typedef ProductRef
 */
const ProductRef = mongoose.model('ProductRef', productRefSchema);

module.exports = ProductRef;
