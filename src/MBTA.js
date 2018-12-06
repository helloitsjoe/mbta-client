const axios = require('axios');
const { convertMs, TimeUnits, Attributes } = require('./utils');

const { MINUTES } = TimeUnits;

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

    fetchPredictions(queryParams) {
        return axios.get(this._buildUrl(PREDICTIONS, queryParams))
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

    arrivals({ predictions, maxArrivals, timeUnits = MINUTES, now = Date.now()/* tooCloseMins, tooFarMins, */ }) {
        const finalPredictions = predictions || this.predictions;

        return selectArrivalISOs(finalPredictions)
            .map(arrivalISO => {
                if (arrivalISO == null) return null;
                const msUntilArrival = new Date(arrivalISO).valueOf() - now;
                return msUntilArrival >= 0 ? msUntilArrival : 0;
            })
            // .filter(msUntilArrival => {
            //     return msUntilArrival > tooClose
            //         && msUntilArrival < tooFar;
            // })
            .slice(0, maxArrivals)
            .map(arrivalMs => {
                // arrivalMs could be null if first stop on a route. Use departures if it's not null
                // See https://www.mbta.com/developers/v3-api/best-practices for more info
                return arrivalMs && Math.floor(convertMs(arrivalMs, timeUnits));
            });
    }

    departures({ predictions, maxDepartures, timeUnits = MINUTES, now = Date.now() }) {
        const finalPredictions = predictions || this.predictions;
        
        return selectDepartureISOs(finalPredictions)
            .map(departureISO => {
                if (departureISO == null) return null;
                const msUntilDeparture = new Date(departureISO).valueOf() - now;
                return msUntilDeparture >= 0 ? msUntilDeparture : 0;
            })
            .slice(0, maxDepartures)
            .map(departureMs => {
                // departureMs could be null if final stop on a route
                // See https://www.mbta.com/developers/v3-api/best-practices for more info
                return departureMs && Math.floor(convertMs(departureMs, timeUnits));
            });
    }

    // _selectArrivalISOs(predictions) {
    //     return this._selectAttribute(Attributes.arrival_time, predictions);
    // }

    // _selectDepartureISOs(predictions) {
    //     return this._selectAttribute(Attributes.departure_time, predictions);
    // }

    // _selectAttribute(attr, predictions) {
    //     if (!predictions || !predictions.data) {
    //         console.warn('No prediction data...');
    //         return [];
    //     }

    //     return predictions.data.map(vehicle => vehicle.attributes[attr]);
    // }

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