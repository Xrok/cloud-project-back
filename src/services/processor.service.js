const { Processor } = require('../models');

/**
 * Get processor by model and brand
 * @param {string} model
 * @param {string} brand
 * @returns {Promise<Processor>}
 */
const findProcessorByBrandAndModel = async (model, brand) => {
  const modelSearch = `${model}$`;

  return Processor.findOne({ brand, model: RegExp(modelSearch) });
};

const getAllProcessors = async () => {
  return Processor.find();
};
const getProcessorById = async (id) => {
  return Processor.findById(id);
};

const submitStoreToProduct = async () => {};

module.exports = {
  findProcessorByBrandAndModel,
  getAllProcessors,
  getProcessorById,
  submitStoreToProduct,
};
