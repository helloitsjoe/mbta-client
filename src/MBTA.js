const {
    buildUrl,
    arrivalsWithConversion,
    departuresWithConversion,
} = require('./predictions');
const fetchService = require('./fetchService');

const PREDICTIONS = '/predictions';
const STOPS = '/stops';

class MBTA {

    constructor(apiKey, fetch = fetchService) {
        this.apiKey = apiKey;
        this.fetch = fetch;
        // Ideally these would have a public getter and private setter
        this.predictions = [];
        this.stops = [];
    }

    /**
     * Fetches predictions from the MBTA v2 API
     * https://api-v3.mbta.com
     */
    async fetchPredictions({ stopID, routeID, tripID, directionID, sort } = {}) {
        const url = buildUrl(PREDICTIONS, { stopID, routeID, tripID, directionID, sort });
        return this.predictions = await this.fetch(url);
    }

    /**
     * Select arrival times from predictions with options to limit
     * the number of arrivals returned, and convert them to time from now
     */
    arrivals({ predictions, max, convertTo, now } = {}) {
        const pred = predictions || this.predictions;
        // TODO: Maybe move predictions out of the object and curry?
        return arrivalsWithConversion({ predictions: pred, max, convertTo, now });
    }
    /**
     * Select departure times from predictions with options to limit
     * the number of arrivals returned, and convert them to time from now
     */
    departures({ predictions, max, convertTo, now } = {}) {
        const pred = predictions || this.predictions;
        return departuresWithConversion({ predictions: pred, max, convertTo, now });
    }
}

module.exports = MBTA;
