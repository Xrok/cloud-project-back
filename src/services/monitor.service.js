const { Monitor } = require('../models');

/**
 * Get processor by model and brand
 * @param {string} model
 * @param {string} brand
 * @returns {Promise<Monitor>}
 */
const findMonitorByBrandAndModel = async (model, brand) => {
  const modelSearch = `${model}$`;

  return Monitor.findOne({ brand, model: RegExp(modelSearch) });
};

const getAllMonitors = async () => {
  return Monitor.find();
};
const getMonitorById = async (id) => {
  return Monitor.findById(id);
};
module.exports = {
  findMonitorByBrandAndModel,
  getMonitorById,
  getAllMonitors,
};
