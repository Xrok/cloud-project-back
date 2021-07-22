// const axios = require('axios');
// const cheerio = require('cheerio');
// const parsePrice = require('./utils/parsePrice');
const { storeService } = require('../../services');
const { monitorController } = require('../../controllers');
const getSubCategories = require('./utils/getSubCategories');
const fetchProduct = require('./utils/fetchProduct');

let category;

const parseInfo = (text) => {
  const header = text.split(' ');
  const brand = header[2];
  let model = header[3];
  if (category.garbage_words.includes(model)) {
    // eslint-disable-next-line prefer-destructuring
    model = header[4];
  }

  return {
    brand,
    model,
  };
};

const fetchMonitor = async () => {
  category = await storeService.getCategoryFromStoreName('memorykings', 'monitor');
  const subCategories = await getSubCategories(category);
  const products = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const subCategory of subCategories) {
    // eslint-disable-next-line no-await-in-loop
    const catProd = await fetchProduct(category, subCategory.url, parseInfo, monitorController.submitMonitor);
    products.push(...catProd);
  }
  await monitorController.purgeMonitors(products, 'memorykings');
};

module.exports = fetchMonitor;
