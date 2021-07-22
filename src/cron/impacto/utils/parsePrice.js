const parsePrice = (text) => {
  const trimmed = text.trim();
  const slashPos = trimmed.indexOf('/');
  const soles = trimmed
    .slice(slashPos + 1)
    .replace('.', '')
    .replace(' ', '');
  const price = parseInt(soles, 10) / 100;
  return price;
};
module.exports = parsePrice;
