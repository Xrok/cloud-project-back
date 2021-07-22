// const axios = require('axios');
// const cheerio = require('cheerio');
const logger = require('../../config/logger');
const { storeService } = require('../../services');
const { monitorController } = require('../../controllers');
const fetchProduct = require('./utils/fetchProduct');
const getPages = require('./utils/getPages');

let category;

const parseInfo = (text) => {
  const trimmed = text.trim();
  if (trimmed.startsWith('monitor')) {
    const parenthesisInitPos = trimmed.indexOf('(');
    const parenthesisEndPos = trimmed.indexOf(')');

    const model = trimmed.slice(parenthesisInitPos + 1, parenthesisEndPos).trim();
    const brand = trimmed.split(' ')[1];

    if (parenthesisInitPos === -1 || parenthesisEndPos === -1) {
      logger.debug(trimmed);
      logger.warn('Format of html have change. MUST check! [ impacto, monitor]');
    }

    return { brand, model };
  }
  return null;
};

const fetchMonitor = async () => {
  category = await storeService.getCategoryFromStoreName('impacto', 'monitor');
  const pages = await getPages(category);

  const products = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const page of pages) {
    // eslint-disable-next-line no-await-in-loop
    const pageProd = await fetchProduct(page, category, parseInfo, monitorController.submitMonitor);
    products.push(...pageProd);
  }
  await monitorController.purgeMonitors(products, 'impacto');
};

module.exports = fetchMonitor;
