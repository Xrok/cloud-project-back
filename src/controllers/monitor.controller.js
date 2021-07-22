const httpStatus = require('http-status');
const _ = require('lodash');
const { monitorService } = require('../services');
const { findMonitorByBrandAndModel } = require('../services/monitor.service');
const { getStoreByUrl } = require('../services/store.service');
const { purgeProductsByCategory, submitProductToStore, addMissingProduct } = require('./store.controller');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const minPrice = require('../utils/minPrice');
const pick = require('../utils/pick');

const getMonitors = catchAsync(async (req, res) => {
  const _result = await monitorService.getAllMonitors();
  const result = _result.map((_monitor) => {
    const monitor = _monitor;
    monitor.price = minPrice(_monitor.stores);
    monitor.stores.sort((a, b) => a.price - b.price);
    const monitorPicked = _.pick(monitor, [
      'brand',
      'model',
      'size',
      'resolution',
      'width',
      'height',
      'refresh_rate',
      'response_time',
      'panel_type',
      'aspect_ratio',
      'price',
      'stores',
    ]);
    return monitorPicked;
  });
  res.send(result);
});

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
const submitMonitor = async (info, storeUrl) => {
  const monitor = await findMonitorByBrandAndModel(info.model, info.brand);

  if (monitor) {
    const store = await getStoreByUrl(storeUrl);
    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    const product = info;
    product._id = monitor._id;

    await submitProductToStore(storeUrl, 'monitor', product);

    const storeMonitor = pick(product, ['price', 'stock', 'link_prod']); // storeMonitor -> Store obj nested in monitor
    storeMonitor.name = store.name;
    storeMonitor.store_id = store._id;

    const storePos = monitor.stores.findIndex((st) => {
      return st.name === storeMonitor.name;
    });

    if (storePos !== -1) {
      monitor.stores[storePos] = storeMonitor;
    } else {
      monitor.stores.push(storeMonitor);
    }

    await monitor.save();
  } else {
    const product = pick(info, ['model', 'brand', 'link_prod']);
    await addMissingProduct(storeUrl, 'monitor', product);
  }
};

const purgeMonitors = async (productArr, storeName) => {
  await purgeProductsByCategory(productArr, storeName, 'monitor');
};

module.exports = {
  getMonitors,
  submitMonitor,
  purgeMonitors,
};
