const {
  arrivalsWithConversion,
  departuresWithConversion,
  selectIncluded,
  selectPage,
  Pages,
} = require('./predictions');
const { buildUrl } = require('./mbta');
const fetchService = require('./fetchService');

const PREDICTIONS = '/predictions';
const SCHEDULES = '/schedules';
const VEHICLES = '/vehicles';
const SERVICES = '/services';
const ROUTES = '/routes';
const SHAPES = '/shapes';
const TRIPS = '/trips';
const STOPS = '/stops';

// TODO: filterByAttribute
// TODO: filterByRelationship

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
    this.schedules = [];
    this.services = [];
    this.vehicles = [];
    this.routes = [];
    this.shapes = [];
    this.trips = [];
    this.stops = [];
  }

  /**
   * Fetch functions
   */
  async fetchPredictions(queryParams) {
    const url = buildUrl(PREDICTIONS, queryParams, this.apiKey);
    this.predictions = await this.fetch(url);
    return this.predictions;
  }

  async fetchStops(queryParams) {
    const url = buildUrl(STOPS, queryParams, this.apiKey);
    this.stops = await this.fetch(url);
    return this.stops;
  }

  async fetchTrips(queryParams) {
    const url = buildUrl(TRIPS, queryParams, this.apiKey);
    this.trips = await this.fetch(url);
    return this.trips;
  }

  async fetchRoutes(queryParams) {
    const url = buildUrl(ROUTES, queryParams, this.apiKey);
    this.routes = await this.fetch(url);
    return this.routes;
  }

  async fetchVehicles(queryParams) {
    const url = buildUrl(VEHICLES, queryParams, this.apiKey);
    this.vehicles = await this.fetch(url);
    return this.vehicles;
  }

  async fetchShapes(queryParams) {
    const url = buildUrl(SHAPES, queryParams, this.apiKey);
    this.shapes = await this.fetch(url);
    return this.shapes;
  }

  async fetchServices(queryParams) {
    const url = buildUrl(SERVICES, queryParams, this.apiKey);
    this.services = await this.fetch(url);
    return this.services;
  }

  async fetchSchedules(queryParams) {
    const url = buildUrl(SCHEDULES, queryParams, this.apiKey);
    this.schedules = await this.fetch(url);
    return this.schedules;
  }

  /**
   * Select arrival/departure times from predictions with options to limit
   * the number of arrivals returned, and convert them to time from now
   */
  arrivals({ predictions = this.predictions, convertTo, now } = {}) {
    // TODO: Maybe move predictions out of the object and curry?
    return arrivalsWithConversion({ predictions, convertTo, now });
  }

  departures({ predictions = this.predictions, convertTo, now } = {}) {
    return departuresWithConversion({ predictions, convertTo, now });
  }

  /**
   * Select included objects by type. An array of types will return
   * objects matching any of the specified types. Omitting 'type'
   * will return the unfiltered 'included' array.
   */
  included(response, type) {
    return selectIncluded(response, type);
  }

  // TODO: How to deal with multiple next/previous requests?
  // Save each request to this.predictions, or require it to be passed in?
  async getFirstPage(predictions) {
    return this.fetch(selectPage(Pages.first, predictions));
  }

  async getNextPage(predictions) {
    return this.fetch(selectPage(Pages.next, predictions));
  }

  async getPrevPage(predictions) {
    return this.fetch(selectPage(Pages.prev, predictions));
  }

  async getLastPage(predictions) {
    const url = selectPage(Pages.last, predictions);
    return this.fetch(url);
  }
}

module.exports = MBTA;
