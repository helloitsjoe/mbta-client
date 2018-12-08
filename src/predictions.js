const { convertMs, Attributes } = require('./utils');
const BASE_URL = 'https://api-v3.mbta.com';

function buildUrl(endpoint, queryParams) {
    const url = BASE_URL + endpoint;

    if (!queryParams || !Object.keys(queryParams).length) {
        return url;
    }

    const keyAdapter = {
        tripID: 'trip',
        stopID: 'stop',
        routeID: 'route',
        directionID: 'direction_id',
    }

    const queryString = Object
        .entries(queryParams)
        .map(([key, value]) => {
            console.log(`key:`, key);
            if (value == null) {
                return;
            }
            if (key === 'sort') {
                return `sort=${value}`;
            }
            return `filter[${keyAdapter[key]}]=${value}`;
        })
        .filter(Boolean)
        .join('&');

    if (this.apiKey == null) {
        console.warn('API key is missing. Keys available at https://api-v3.mbta.com');
        return `${url}?${queryString}`;
    }

    return `${url}?${queryString}&api_key=${this.apiKey}`;
}

const selectAttribute = attr => predictions => {
    if (!predictions || !predictions.data) {
        console.warn('No prediction data...');
        return [];
    }

    return predictions.data.map(vehicle => vehicle.attributes[attr]);
}

const convertTimes = selector => ({ predictions, max, convertTo, now = Date.now() }) => {
    return selector(predictions)
        .slice(0, max)
        .map(isoString => {
            // arrival could be null if first stop on a route. Use departures if it's not null
            // departure could be null if final stop on a route
            // See https://www.mbta.com/developers/v3-api/best-practices for more info
            if (convertTo == null || isoString == null) return isoString;

            const msFromNow = new Date(isoString).valueOf() - now;
            const unitsFromNow = Math.floor(convertMs(msFromNow, convertTo));

            return unitsFromNow >= 0 ? unitsFromNow : 0;
        });
}

const selectArrivalISOs = selectAttribute(Attributes.arrival_time);
const selectDepartureISOs = selectAttribute(Attributes.departure_time);

const arrivalsWithConversion = convertTimes(selectArrivalISOs);
const departuresWithConversion = convertTimes(selectDepartureISOs);

module.exports = {
    buildUrl,
    convertTimes,
    arrivalsWithConversion,
    departuresWithConversion,
}