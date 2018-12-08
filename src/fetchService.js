const axios = require('axios');

const fetchService = async (url) => {
    try {
        const res = await axios.get(url)
        if (!res || !res.data) {
            const err = { message: 'No data from MBTA' };
            throw new Error(err);
        }
        return res.data;
    } catch (err) {   
        const { response } = err;
        if (response && response.data && response.data.errors) {
            const [error] = response.data.errors;
            console.error(`Error ${error.status} fetching MBTA data: ${error.detail}`);
        } else {
            console.error('Error fetching MBTA data:', err.message);
        }
        throw err;
    }
}

module.exports = fetchService;