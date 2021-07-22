const asyncSome = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate));
  return arr.some((_v, index) => results[index]);
};
module.exports = asyncSome;
