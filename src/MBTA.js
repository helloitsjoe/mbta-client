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

    async fetchPredictions({ stopID, routeID, directionID, sort }) {
        const url = buildUrl(PREDICTIONS, { stopID, routeID, directionID, sort });
        return this.predictions = await this.fetch(url);
    }

    arrivals({ predictions, max, convertTo, now } = {}) {
        const pred = predictions || this.predictions;
        return arrivalsWithConversion({ predictions: pred, max, convertTo, now });
    }

    departures({ predictions, max, convertTo, now } = {}) {
        const pred = predictions || this.predictions;
        return departuresWithConversion({ predictions: pred, max, convertTo, now });
    }
}

module.exports = MBTA;