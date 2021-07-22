const minPrice = (stores) => {
  let min = Number.MAX_VALUE;
  if (stores === undefined) {
    return 0;
  }
  for (let i = 0; i < stores.length; i += 1) {
    if (stores[i].price < min) min = stores[i].price;
  }
  if (min === Number.MAX_VALUE) {
    return null;
  }
  return min;
};

module.exports = minPrice;
