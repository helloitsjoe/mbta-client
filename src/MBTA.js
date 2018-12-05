const axios = require('axios');
const { convertMs } = require('./utils');

const BASE_URL = 'https://api-v3.mbta.com';
const PREDICTIONS = '/predictions';
const STOPS = '/stops';

class MBTA {

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.predictions = [];
        this.stops = [];

        // mbta.predict({
        //     stopID: 'someID',
        //     directionID: '1',
        //     sort: 'sortOption'
        // });
    }

    fetchPredictions(queryParams) {
        const finalQuery = queryParams;

        return axios.get(this._buildUrl(PREDICTIONS, finalQuery))
            .then(res => {
                if (!res || !res.data) {
                    throw new Error('No data from MBTA');
                }
                return this.predictions = res.data;
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data && response.data.errors) {
                    const [error] = response.data.errors;
                    console.error(`Error ${error.status} fetching MBTA data: ${error.detail}`);
                } else {
                    console.error('Error fetching MBTA data:', err.message);
                }
                throw err;
            });
    }

    arrivals({ predictions, maxArrivals, timeUnits = 'MINUTES', /* tooCloseMins, tooFarMins, */ }) {
        const finalPredictions = predictions || this.predictions;
        
        return this._selectArrivalISOs(finalPredictions)
            .map(arrivalISO => {
                if (arrivalISO == null) return 0;
                const msUntilArrival = new Date(arrivalISO).valueOf() - Date.now();
                return msUntilArrival >= 0 ? msUntilArrival : 0;
            })
            // .filter(msUntilArrival => {
            //     return msUntilArrival > tooClose
            //         && msUntilArrival < tooFar;
            // })
            .slice(0, maxArrivals)
            .map(arrivalMs => {
                return Math.floor(convertMs(arrivalMs, timeUnits));
            });
    }

    _selectArrivalISOs(predictions) {
        if (!predictions || !predictions.data) {
            console.warn('No prediction data...');
            return [];
        }

        return predictions.data.map(vehicle => vehicle.attributes.arrival_time);
    }

    _buildUrl(endpoint, queryParams) {
        const url = BASE_URL + endpoint;

        if (!queryParams || !Object.keys(queryParams).length) {
            return url;
        }

        const keyAdapter = {
            stopID: 'stop',
            directionID: 'direction_id',
        }

        const queryString = Object
            .entries(queryParams)
            .map(([key, value]) => {
                if (value == null) {
                    return;
                }
                if (key === 'stopID' || key === 'directionID') {
                    return `filter[${keyAdapter[key]}]=${value}`;
                }
                if (key === 'sort') {
                    return `sort=${value}`;
                }
            })
            .filter(Boolean)
            .join('&');

        if (this.apiKey == null) {
            console.warn('API key is missing. Keys available at https://api-v3.mbta.com');
            return `${url}?${queryString}`;
        }

        return `${url}?${queryString}&api_key=${this.apiKey}`;
    }
}

module.exports = MBTA;