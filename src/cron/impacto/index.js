const fetchProcessor = require('./processor');
const fetchMonitor = require('./monitor');
const logger = require('../../config/logger');

const fecthData = async () => {
  try {
    logger.info('Started fetching impacto store');
    await fetchProcessor();
    // await fetchMonitor();
    logger.info('Finished fetching impacto store');
  } catch (error) {
    logger.error('Error fetching Impacto');
    logger.error(error);
  }
};

module.exports = { fecthData };
