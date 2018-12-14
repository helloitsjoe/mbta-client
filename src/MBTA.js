const {
  arrivalsWithConversion,
  departuresWithConversion,
  selectIncluded,
  selectPage,
  Pages,
} = require('./predictions');
const { buildUrl } = require('./utils');
const fetchService = require('./fetchService');

const PREDICTIONS = '/predictions';
const ROUTES = '/routes';
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
    const url = buildUrl(PREDICTIONS, this.apiKey, queryParams);
    this.predictions = await this.fetch(url);
    return this.predictions;
  }

  async fetchStops(queryParams) {
    const url = buildUrl(STOPS, this.apiKey, queryParams);
    this.predictions = await this.fetch(url);
    return this.predictions;
  }

  async fetchRoutes(queryParams) {
    const url = buildUrl(ROUTES, this.apiKey, queryParams);
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
   * Select included objects by type. An array of types will return
   * objects matching any of the specified types. Omitting 'type'
   * will return the unfiltered 'included' array.
   */
  included(predictions, type) {
    const pred = predictions || this.predictions;
    return selectIncluded(pred, type);
  }

  // TODO: How to deal with multiple next/previous requests?
  // Save each request to this.predictions, or require it to be passed in?
  async getFirstPage(predictions) {
    const url = selectPage(Pages.first, predictions);
    return this.fetch(url);
  }

  async getNextPage(predictions) {
    const url = selectPage(Pages.next, predictions);
    return this.fetch(url);
  }

  async getPrevPage(predictions) {
    const url = selectPage(Pages.prev, predictions);
    return this.fetch(url);
  }

  async getLastPage(predictions) {
    const url = selectPage(Pages.last, predictions);
    return this.fetch(url);
  }
}

module.exports = MBTA;
