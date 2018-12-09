const {
  buildUrl,
  arrivalsWithConversion,
  departuresWithConversion,
  selectLinks,
} = require('./predictions');
const fetchService = require('./fetchService');

const PREDICTIONS = '/predictions';
const STOPS = '/stops';

/**
 * Client for the MBTA v3 API
 * https://api-v3.mbta.com
 */
class MBTA {
  constructor(apiKey, fetch = fetchService) {
    this.apiKey = apiKey;
    this.fetch = fetch;
    // Ideally these would have a public getter and private setter
    this.predictions = [];
    this.stops = [];
  }

  async fetchPredictions(queryParams) {
    const url = buildUrl(PREDICTIONS, queryParams);
    this.predictions = await this.fetch(url);
    return this.predictions;
  }

  async fetchStops(queryParams) {
    const url = buildUrl(STOPS, queryParams);
    this.predictions = await this.fetch(url);
    return this.predictions;
  }

  /**
   * Select arrival times from predictions with options to limit
   * the number of arrivals returned, and convert them to time from now
   */
  arrivals({ predictions, convertTo, now } = {}) {
    const pred = predictions || this.predictions;
    // TODO: Maybe move predictions out of the object and curry?
    return arrivalsWithConversion({ predictions: pred, convertTo, now });
  }

  /**
   * Select departure times from predictions with options to limit
   * the number of arrivals returned, and convert them to time from now
   */
  departures({ predictions, convertTo, now } = {}) {
    const pred = predictions || this.predictions;
    return departuresWithConversion({ predictions: pred, convertTo, now });
  }

  /**
   * If predictions are paginated (with page[limit]),
   * returns paginated links: first, next, last[, previous]
   */
  paginate(predictions) {
    const pred = predictions || this.predictions;
    if (!pred.links) {
      throw new Error('Pagination requires predictions query to include "limit"');
    }
    return selectLinks(pred);
  }
}

module.exports = MBTA;
