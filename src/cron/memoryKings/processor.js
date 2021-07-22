const { storeService } = require('../../services');
const { processorController } = require('../../controllers');
const getSubCategories = require('./utils/getSubCategories');
const fetchProduct = require('./utils/fetchProduct');

let category;

const parseInfo = (text) => {
  let model = text.split(' ');
  let brand;
  if (model.includes('intel')) {
    brand = 'intel';
  }
  if (model.includes('amd')) {
    brand = 'amd';
  }

  model = model.filter((el) => {
    return !category.garbage_words
      .map((g) => {
        return el.includes(g);
      })
      .includes(true);
  });
  model = model.join(' ');

  return {
    model,
    brand,
  };
};

const fetchProcessor = async () => {
  category = await storeService.getCategoryFromStoreName('memorykings', 'processor');
  const subCategories = await getSubCategories(category);

  const products = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const subCategory of subCategories) {
    // eslint-disable-next-line no-await-in-loop
    const idsProd = await fetchProduct(category, subCategory.url, parseInfo, processorController.submitProcessor);
    // const catProd = await fetchProcessorProduct(subCategory.url);
    products.push(...idsProd);
  }

  await processorController.purgeProcessors(products, 'memorykings');
};

module.exports = fetchProcessor;
