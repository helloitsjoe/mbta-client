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
 * Node.js client for the MBTA v3 API
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
    return this.fetch(url);
  }

  async fetchStops(queryParams) {
    const url = buildUrl(STOPS, queryParams, this.apiKey);
    return this.fetch(url);
  }

  async fetchTrips(queryParams) {
    const url = buildUrl(TRIPS, queryParams, this.apiKey);
    return this.fetch(url);
  }

  async fetchRoutes(queryParams) {
    const url = buildUrl(ROUTES, queryParams, this.apiKey);
    return this.fetch(url);
  }

  async fetchVehicles(queryParams) {
    const url = buildUrl(VEHICLES, queryParams, this.apiKey);
    return this.fetch(url);
  }

  async fetchShapes(queryParams) {
    const url = buildUrl(SHAPES, queryParams, this.apiKey);
    return this.fetch(url);
  }

  async fetchServices(queryParams) {
    const url = buildUrl(SERVICES, queryParams, this.apiKey);
    return this.fetch(url);
  }

  async fetchSchedules(queryParams) {
    const url = buildUrl(SCHEDULES, queryParams, this.apiKey);
    return this.fetch(url);
  }

  async fetchFacilities(queryParams) {
    const url = buildUrl(FACILITIES, queryParams, this.apiKey);
    return this.fetch(url);
  }

  // async fetchAllRoutesBasic({ type } = {}) {
  //   const routes = await this.fetchRoutes({ type });
  //   return routes.data.map(ea => ({
  //     id: ea.id,
  //     abbr: ea.attributes.short_name,
  //     name: ea.attributes.long_name,
  //     directions: ea.attributes.direction_names,
  //   }));
  // }

  // async fetchAllStopsByRoute(route) {
  //   const stops = await this.fetchStops({ route });
  //   return stops.data.map(stop => ({
  //     name: stop.attributes.name,
  //     id: stop.id,
  //   }));
  // }

  // async fetchStopByName(name, { exact } = {}) {
  //   const allStops = await this.fetchStops();
  //   return allStops.data.filter(stop => {
  //     if (exact) {
  //       return stop.attributes.name === name;
  //     }
  //     return stop.attributes.name.match(name);
  //   });
  // }

  /**
   * Select arrival/departure times from predictions with options to limit
   * the number of arrivals returned, and convert them to time from now
   */
  arrivals({ response, convertTo, now } = {}) {
    return arrivalsWithConversion({ response, convertTo, now });
  }

  departures({ response, convertTo, now } = {}) {
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

  /**
   * Helper functions to fetch pages when working
   * with a response that includes paginated links
   */
  async fetchFirstPage(response) {
    return this.fetch(selectPage(Pages.first, response));
  }

  async fetchNextPage(response) {
    return this.fetch(selectPage(Pages.next, response));
  }

  async fetchPrevPage(response) {
    return this.fetch(selectPage(Pages.prev, response));
  }

  async fetchLastPage(response) {
    return this.fetch(selectPage(Pages.last, response));
  }
}

module.exports = MBTA;
