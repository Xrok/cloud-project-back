const parsePrice = (text) => {
  let price = text.substring(text.search('S/.') + 3, text.length);
  price = parseInt(price.replace('.', '').replace(',', ''), 10) / 100;
  return price;
};

module.exports = parsePrice;
