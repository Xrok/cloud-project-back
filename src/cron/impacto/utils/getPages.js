const axios = require('axios');
const cheerio = require('cheerio');

const getPages = async (category) => {
  const pages = [];
  const response = await axios.get(category.store_url + category.url);
  const $ = cheerio.load(response.data);
  const pagesCant = $('.pagination').children().length - 2;
  for (let i = 1; i <= pagesCant; i += 1) {
    pages.push(`${category.store_url + category.url}&page=${i}`);
  }
  return pages;
};

module.exports = getPages;
