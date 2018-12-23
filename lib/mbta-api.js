/* eslint-disable camelcase */
const {
  arrivalsWithConversion,
  departuresWithConversion,
  selectIncluded,
  selectPage,
  Pages,
} = require('./utils');
const { buildUrl } = require('./mbta');
const fetchService = require('./fetchService');

const PREDICTIONS = '/predictions';
const FACILITIES = '/facilities';
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

  async fetchFacilities(queryParams) {
    const url = buildUrl(FACILITIES, queryParams, this.apiKey);
    this.facilities = await this.fetch(url);
    return this.facilities;
  }

  async fetchAllRoutesBasic({ type } = {}) {
    const routes = await this.fetchRoutes({ type });
    return routes.data.map(ea => ({
      id: ea.id,
      abbr: ea.attributes.short_name,
      name: ea.attributes.long_name,
      directions: ea.attributes.direction_names,
    }));
  }

  async fetchAllStopsByRoute(route) {
    const stops = await this.fetchStops({ route });
    return stops.data.map(stop => ({
      name: stop.attributes.name,
      id: stop.id,
    }));
  }

  async fetchStopByName(name, { exact } = {}) {
    const allStops = await this.fetchStops();
    return allStops.data.filter(stop => {
      if (exact) {
        return stop.attributes.name === name;
      }
      return stop.attributes.name.match(name);
    });
  }

  /**
   * Select arrival/departure times from predictions with options to limit
   * the number of arrivals returned, and convert them to time from now
   */
  arrivals({ response = this.predictions, convertTo, now } = {}) {
    // TODO: Maybe move predictions out of the object and curry?
    return arrivalsWithConversion({ response, convertTo, now });
  }

  departures({ response = this.predictions, convertTo, now } = {}) {
    return departuresWithConversion({ response, convertTo, now });
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
  async getFirstPage(response) {
    return this.fetch(selectPage(Pages.first, response));
  }

  async getNextPage(response) {
    return this.fetch(selectPage(Pages.next, response));
  }

  async getPrevPage(response) {
    return this.fetch(selectPage(Pages.prev, response));
  }

  async getLastPage(response) {
    return this.fetch(selectPage(Pages.last, response));
  }
}

module.exports = MBTA;
