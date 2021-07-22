const axios = require('axios');
const cheerio = require('cheerio');

const getSubCategories = async (category) => {
  const subCategories = [];
  const response = await axios.get(category.store_url + category.url);
  const $ = cheerio.load(response.data);
  $('.products')
    .find('li >  div > a')
    .each((index, element) => {
      const text = $(element).find('h4').text().toLowerCase();
      if (!text.toLowerCase().includes('cooler')) {
        subCategories.push({
          text,
          url: category.store_url + $(element).attr('href').slice(1),
        });
      }
    });
  return subCategories;
};

module.exports = getSubCategories;
