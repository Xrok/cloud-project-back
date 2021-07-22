const cron = require('node-cron');
const config = require('../config/config');
const MemoryKings = require('./memoryKings');
const Impacto = require('./impacto');
const logger = require('../config/logger');

const fetchDataStores = async () => {
  await MemoryKings.fetchData();
  await Impacto.fecthData();
  logger.info('Finished fetching stores!!');
};

const fechData = () => {
  if (config.env !== 'development') {
    fetchDataStores();
    cron.schedule('* 3 * * *', () => {
      fetchDataStores();
    });
  } else {
    fetchDataStores();
  }
};

module.exports = fechData;
