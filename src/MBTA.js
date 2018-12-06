const axios = require('axios');
const { convertMs, Attributes } = require('./utils');

const BASE_URL = 'https://api-v3.mbta.com';
const PREDICTIONS = '/predictions';
const STOPS = '/stops';

const selectAttribute = attr => predictions => {
    if (!predictions || !predictions.data) {
        console.warn('No prediction data...');
        return [];
    }

    return predictions.data.map(vehicle => vehicle.attributes[attr]);
}

const selectArrivalISOs = selectAttribute(Attributes.arrival_time);
const selectDepartureISOs = selectAttribute(Attributes.departure_time);

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

    fetchPredictions({ stopID, routeID, directionID, sort }) {
        return axios.get(this._buildUrl(PREDICTIONS, { stopID, routeID, directionID, sort }))
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

    arrivals({ predictions, max, units, now }) {
        return this._convertTimes(selectArrivalISOs, { predictions, max, units, now })
    }

    departures({ predictions, max, units, now }) {
        return this._convertTimes(selectDepartureISOs, { predictions, max, units, now })
    }

    _convertTimes(selector, { predictions, max, units, now = Date.now() }) {
        const finalPredictions = predictions || this.predictions;

        return selector(finalPredictions)
            .slice(0, max)
            .map(arrivalISO => {
                // arrivalISO could be null if first stop on a route. Use departures if it's not null
                // See https://www.mbta.com/developers/v3-api/best-practices for more info
                if (units == null || arrivalISO == null) return arrivalISO;

                const arrivalInMs = new Date(arrivalISO).valueOf() - now;
                const unitsUntilArrival = Math.floor(convertMs(arrivalInMs, units));

                return unitsUntilArrival >= 0 ? unitsUntilArrival : 0;
            });
    }

    _buildUrl(endpoint, queryParams) {
        const url = BASE_URL + endpoint;

        if (!queryParams || !Object.keys(queryParams).length) {
            return url;
        }

        const keyAdapter = {
            stopID: 'stop',
            routeID: 'route',
            directionID: 'direction_id',
        }

        const queryString = Object
            .entries(queryParams)
            .map(([key, value]) => {
                if (value == null) {
                    return;
                }
                if (key === 'sort') {
                    return `sort=${value}`;
                }
                // if (key === 'stopID' || key === 'directionID' || key === 'route_id') {
                    return `filter[${keyAdapter[key]}]=${value}`;
                // }
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