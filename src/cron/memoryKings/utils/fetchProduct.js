const axios = require('axios');
const cheerio = require('cheerio');
const parsePrice = require('./parsePrice');
const logger = require('../../../config/logger');

const fetchProduct = async (category, url, parseInfo, submit) => {
  const products = [];
  const productsToSubmit = [];
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  $('.products')
    .find('li > div')
    .each((index, element) => {
      const info = parseInfo($(element).find('a > .content > .title > h4').text().toLowerCase(), category.garbage_words);
      const prodUrl = $(element).find('a').attr('href');
      const price = parsePrice($(element).find('.price').text());
      const product = {
        brand: info.brand,
        model: info.model,
        price,
        stock: true,
        link_prod: (category.store_url + prodUrl.slice(1)).toLowerCase(),
      };
      logger.debug(`{ brand: ${info.brand}, model: ${info.model} }`);
      // products.push(info);
      productsToSubmit.push(product);
    });

  // eslint-disable-next-line no-restricted-syntax
  for (const prod of productsToSubmit) {
    // eslint-disable-next-line no-await-in-loop
    const idProd = await submit(prod, category.store_url);
    products.push(idProd);
  }
  return products;
};

module.exports = fetchProduct;
