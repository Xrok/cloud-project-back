/* eslint-disable no-return-await */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { getStoreByUrl, getStoreByName } = require('../services/store.service');
const { getProcessorById } = require('../services/processor.service');
const pick = require('../utils/pick');
const logger = require('../config/logger');
const asyncFilter = require('../utils/asyncFilter');
const asyncSome = require('../utils/asyncSome');
const { getMonitorById } = require('../services/monitor.service');
/**
 * Submit a product to a store
 * @param {string} storeUrl
 * @param {string} categoryName
 * @param {object} product
 * @param {number} product.price
 * @param {boolean} product.stock
 */
const submitProductToStore = async (storeUrl, categoryName, product) => {
  const newProduct = pick(product, ['price', 'stock']);

  newProduct.prod_id = product._id;

  const store = await getStoreByUrl(storeUrl);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }

  const categoryIndex = store.getCategoryIndex(categoryName);
  if (categoryIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  let oldProduct = store.categories[categoryIndex].products.find((prod) => {
    return String(prod.prod_id) === String(product._id);
  });
  if (oldProduct) {
    oldProduct = newProduct;
  } else {
    store.categories[categoryIndex].products.push(newProduct);
  }
  const index = store.categories[categoryIndex].missing_products.findIndex((prod) => {
    return prod.model === product.model && prod.brand === product.brand;
  });
  if (index > -1) {
    store.categories[categoryIndex].missing_products.splice(index, 1);
  }
  await store.save();
};

const purgeProductsByCategory = async (productArr, storeName, categoryName) => {
  const store = await getStoreByName(storeName);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }

  const categoryIndex = store.getCategoryIndex(categoryName);
  if (categoryIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  let storeProds = await Promise.all(
    store.categories[categoryIndex].products.map(async (prod) => {
      if (productArr.includes(String(prod.prod_id))) {
        return prod;
      }
      logger.debug(`Purge ${prod.prod_id}`);
      switch (categoryName) {
        case 'processor': {
          const productDocument = await getProcessorById(prod.prod_id);
          productDocument.stores = productDocument.stores.filter((storeOnProd) => {
            return storeName !== storeOnProd.name;
          });
          await productDocument.save();
          break;
        }
        case 'monitor': {
          const productDocument = await getMonitorById(prod.prod_id);
          productDocument.stores = productDocument.stores.filter((storeOnProd) => {
            return storeName !== storeOnProd.name;
          });
          await productDocument.save();
          break;
        }
        default:
          logger.warning(`Category ${categoryName} not implemented.`);
      }
    })
  );
  storeProds = storeProds.filter((prod) => {
    return prod != null;
  });
  store.categories[categoryIndex].products = storeProds;

  await store.save();
};

/**
 * Submit a product to the missing products list
 * @param {string} storeUrl
 * @param {string} categoryName
 * @param {object} product
 * @param {string} product.brand
 * @param {string} product.model
 * @param {string} product.link_prod
 */
const addMissingProduct = async (storeUrl, categoryName, product) => {
  const store = await getStoreByUrl(storeUrl);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }

  const category = store.getCategory(categoryName);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  // logger.debug(`category.missing_products \n ${category.missing_products}`);
  // logger.debug(`typeof product.link_prod: ${typeof product.link_prod}`);

  if (
    !category.missing_products.some((el) => {
      // logger.debug(`\n${el.link_prod} : cat.missing\n${product.link_prod} : prod.link`);
      return el.link_prod === product.link_prod;
    })
  ) {
    category.missing_products.push(product);
  }
  await store.save();
};

module.exports = {
  submitProductToStore,
  purgeProductsByCategory,
  addMissingProduct,
};
