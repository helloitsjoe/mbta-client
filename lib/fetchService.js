const axios = require('axios');

const fetchService = async (url, service = axios, logger = console) => {
  try {
    const res = await service.get(url);
    if (!res || !res.data) {
      throw new Error('No data from MBTA');
    }
    return res.data;
  } catch (err) {
    const { response } = err;
    if (response && response.data && response.data.errors) {
      const [error] = response.data.errors;
      logger.error(
        `Error ${error.status ||
          error.code} fetching MBTA data: ${error.detail || '(no details)'}`
      );
      throw error;
    } else {
      logger.error('Error fetching MBTA data:', err.message);
    }
    throw err;
  }
};

module.exports = fetchService;
