const httpStatus = require('http-status');
const _ = require('lodash');
const logger = require('../config/logger');
const { processorService } = require('../services');
const { findProcessorByBrandAndModel, submitStoreToProduct } = require('../services/processor.service');
const { getStoreByUrl } = require('../services/store.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const minPrice = require('../utils/minPrice');
const pick = require('../utils/pick');
const { purgeProductsByCategory, submitProductToStore, addMissingProduct } = require('./store.controller');

/**
 * Add the parsed Processor to the database
 * @param {object} info
 * @param {string} info.brand
 * @param {string} info.model
 * @param {string} info.link_prod
 * @param {number} info.price
 * @param {boolean} info.stock
 * @param {string} storeUrl
 */
const submitProcessor = async (info, storeUrl) => {
  const processor = await findProcessorByBrandAndModel(info.model, info.brand);

  if (processor) {
    logger.debug(`{ brand: ${info.brand}, model: ${info.model} } | FOUND`);
    const store = await getStoreByUrl(storeUrl);
    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    const product = info;
    product._id = processor._id;

    await submitProductToStore(storeUrl, 'processor', product);

    await submitStoreToProduct();

    const storeProcessor = pick(product, ['price', 'stock', 'link_prod']);
    storeProcessor.name = store.name;
    storeProcessor.store_id = store._id;

    const storePos = processor.stores.findIndex((st) => {
      return st.name === storeProcessor.name;
    });

    logger.debug(`store pos: ${storePos}`);
    if (storePos !== -1) {
      processor.stores[storePos] = storeProcessor;
    } else {
      processor.stores.push(storeProcessor);
    }
    // logger.debug(`processor: \n ${processor}`);
    await processor.save();
    return String(processor._id);
  }
  logger.debug(`{ brand: ${info.brand}, model: ${info.model} } | NOT-FOUND`);
  const product = pick(info, ['model', 'brand', 'link_prod']);
  await addMissingProduct(storeUrl, 'processor', product);
  return null;
};

const getProcessors = catchAsync(async (req, res) => {
  const result = await processorService.getAllProcessors();
  const response = result.map((_processor) => {
    const processor = _processor;
    processor.price = minPrice(processor.stores);
    processor.stores.sort((a, b) => a.price - b.price);
    const processorPicked = _.pick(processor, [
      'brand',
      'model',
      'cores',
      'base_clock',
      'boost_clock',
      'tdp',
      'integrated_graphics',
      'multithreading',
      'price',
      'stores',
    ]);
    return processorPicked;
  });
  res.send(response);
});

const purgeProcessors = async (productArr, storeName) => {
  await purgeProductsByCategory(productArr, storeName, 'processor');
};

module.exports = {
  submitProcessor,
  getProcessors,
  purgeProcessors,
};
