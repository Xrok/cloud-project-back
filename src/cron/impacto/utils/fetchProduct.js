const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../../../config/logger');
const parsePrice = require('./parsePrice');

const fetchProduct = async (url, category, parseInfo, submit) => {
  const products = [];
  const productsToSubmit = [];
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  $('.single-product').each((index, element) => {
    const info = parseInfo($(element).find('.product-content > h4 > a').text().toLowerCase());
    if (info) {
      const price = parsePrice($(element).find('.product-content > div > span').text().toLowerCase());
      const prodUrl = $(element).find('.product-image > a').attr('href');

      const product = {
        brand: info.brand,
        model: info.model,
        stock: true,
        price,
        link_prod: prodUrl.toLowerCase(),
      };
      logger.debug(`{ brand: ${info.brand}, model: ${info.model} }`);
      productsToSubmit.push(product);
      // products.push(info);
    }
  });
  // eslint-disable-next-line no-restricted-syntax
  for (const prod of productsToSubmit) {
    // eslint-disable-next-line no-await-in-loop
    products.push(await submit(prod, category.store_url));
  }
  return products;
};

module.exports = fetchProduct;
