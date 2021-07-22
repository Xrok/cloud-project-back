const fetchProcessor = require('./processor');
const fetchMonitor = require('./monitor');
const logger = require('../../config/logger');

const fetchData = async () => {
  try {
    logger.info('Started fetching memoryKings store');
    await fetchProcessor();
    // await fetchMonitor();
    logger.info('Finished fetching memoryKings store');
  } catch (error) {
    logger.error('Error fetching MemoryKings');
    logger.error(error);
  }
};

module.exports = { fetchData };
