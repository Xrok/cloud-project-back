const { storeService } = require('../../services');
const { processorController } = require('../../controllers');
const fetchProduct = require('./utils/fetchProduct');
const getPages = require('./utils/getPages');

let category;

const parseInfo = (text) => {
  let brand;
  let model;
  const trimmed = text.trim();
  if (trimmed.startsWith('proc.')) {
    const parenthesisPos = trimmed.indexOf('(');
    const header = trimmed.slice(0, parenthesisPos).trim().split(' ');

    // eslint-disable-next-line prefer-destructuring
    brand = header[1];
    model = header.filter((el) => {
      return !category.garbage_words
        .map((g) => {
          return el.includes(g);
        })
        .includes(true);
    });
    if (model[model.length - 1] === 'avenger') {
      model.pop();
      model[model.length - 1] += 'a';
    }
    model = model.join(brand === 'intel' ? '-' : ' ');

    return { brand, model };
  }
  return null;
};

const fetchProcessor = async () => {
  category = await storeService.getCategoryFromStoreName('impacto', 'processor');
  const pages = await getPages(category);
  const products = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const page of pages) {
    // eslint-disable-next-line no-await-in-loop
    const pageProd = await fetchProduct(page, category, parseInfo, processorController.submitProcessor);
    products.push(...pageProd);
  }
  await processorController.purgeProcessors(products, 'impacto');
};

module.exports = fetchProcessor;
