const mongoose = require('mongoose');
const { categories } = require('../config/categories');
const { toJSON, paginate } = require('./plugins');
const ProductRef = require('./productRef.model');

const storeSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    categories: [
      {
        category: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
          enum: categories,
          unique: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        products: [ProductRef.schema],
        missing_products: [
          {
            _id: false,
            model: {
              type: String,

              trim: true,
              lowercase: true,
            },
            brand: {
              type: String,

              trim: true,
              lowercase: true,
            },
            link_prod: {
              type: String,

              trim: true,
              lowercase: true,
            },
          },
        ],
        garbage_words: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

storeSchema.plugin(toJSON);
storeSchema.plugin(paginate);

storeSchema.methods.getCategory = function (categoryName) {
  const [category] = this.categories.filter((cat) => {
    return cat.category === categoryName;
  });
  return category;
};

storeSchema.methods.getCategoryIndex = function (categoryName) {
  return this.categories.findIndex((cat) => {
    return cat.category === categoryName;
  });
};

/**
 * @typedef Store
 */
const Store = mongoose.model('Store', storeSchema, 'stores');

module.exports = Store;
