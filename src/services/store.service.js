const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Store } = require('../models');

/**
 * @typedef {Object} CategoryRet
 * @property {string} category
 * @property {string} url
 * @property {string} store_url
 * @property {string[]} garbage_words
 * @property {object[]} missing_products
 * @property {object[]} products
 */

/**
 * Get Store by name
 * @param {string} name
 * @returns {Promise<Store>}
 */
const getStoreByName = async (name) => {
  return Store.findOne({ name });
};

/**
 * Get Store by Url
 * @param {string} url
 * @returns {Promise<Store>}
 */
const getStoreByUrl = async (url) => {
  return Store.findOne({ url });
};

/**
 * Get category of a Store by its name
 * @param {string} storeName
 * @param {string} categoryName
 * @returns {CategoryRet}
 */
const getCategoryFromStoreName = async (storeName, categoryName) => {
  const store = await getStoreByName(storeName);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }
  const category = store.getCategory(categoryName);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  category.store_url = store.url;
  return category;
};

// /**
//  * Submit a product to a store
//  * @param {string} storeUrl
//  * @param {string} categoryName
//  * @param {object} product
//  * @param {number} product.price
//  * @param {boolean} product.stock
//  */
// const submitProductToStore = async (storeUrl, categoryName, product) => {
//   const newProduct = pick(product, ['price', 'stock']);

//   newProduct.prod_id = product._id;

//   const store = await getStoreByUrl(storeUrl);
//   if (!store) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
//   }

//   const category = store.getCategory(categoryName);
//   if (!category) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
//   }

//   let oldProduct = category.products.find((prod) => {
//     return String(prod.prod_id) === String(product._id);
//   });
//   if (oldProduct) {
//     oldProduct = newProduct;
//   } else {
//     category.products.push(newProduct);
//   }
//   const index = category.missing_products.findIndex((prod) => {
//     return prod.model === product.model && prod.brand === product.brand;
//   });
//   if (index > -1) {
//     category.missing_products.splice(index, 1);
//   }
//   await store.save();
// };

module.exports = {
  getCategoryFromStoreName,
  getStoreByName,
  getStoreByUrl,
  // submitProductToStore,
  // addMissingProduct,
};
