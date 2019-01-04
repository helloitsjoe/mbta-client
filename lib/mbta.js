/* eslint-disable camelcase */
const {
  buildUrl,
  arrivalsWithConversion,
  departuresWithConversion,
} = require('./utils');
const { selectPage, selectIncluded } = require('./selectors');
const fetchService = require('./fetchService');
const { Pagination } = require('./constants');

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
    return this.fetch(buildUrl('/predictions', queryParams, this.apiKey));
  }

  async fetchStops(queryParams) {
    return this.fetch(buildUrl('/stops', queryParams, this.apiKey));
  }

  async fetchTrips(queryParams) {
    return this.fetch(buildUrl('/trips', queryParams, this.apiKey));
  }

  async fetchRoutes(queryParams) {
    return this.fetch(buildUrl('/routes', queryParams, this.apiKey));
  }

  async fetchVehicles(queryParams) {
    return this.fetch(buildUrl('/vehicles', queryParams, this.apiKey));
  }

  async fetchShapes(queryParams) {
    return this.fetch(buildUrl('/shapes', queryParams, this.apiKey));
  }

  async fetchServices(queryParams) {
    return this.fetch(buildUrl('/services', queryParams, this.apiKey));
  }

  async fetchSchedules(queryParams) {
    return this.fetch(buildUrl('/schedules', queryParams, this.apiKey));
  }

  async fetchFacilities(queryParams) {
    return this.fetch(buildUrl('/facilities', queryParams, this.apiKey));
  }

  async fetchLiveFacilities(queryParams) {
    return this.fetch(buildUrl('/live-facilities', queryParams, this.apiKey));
  }

  async fetchAlerts(queryParams) {
    return this.fetch(buildUrl('/alerts', queryParams, this.apiKey));
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
  selectArrivals(response, { convertTo, now } = {}) {
    return arrivalsWithConversion({ response, convertTo, now });
  }

  selectDepartures(response, { convertTo, now } = {}) {
    return departuresWithConversion({ response, convertTo, now });
  }

  /**
   * Select included objects by type. An array of types will return
   * objects matching any of the specified types. Omitting 'type'
   * will return the unfiltered 'included' array.
   */
  selectIncluded(response, type) {
    return selectIncluded(response, type);
  }

  /**
   * Helper functions to fetch pages when working
   * with a response that includes paginated links
   */
  async fetchFirstPage(response) {
    return this.fetch(selectPage(Pagination.first, response));
  }

  async fetchNextPage(response) {
    return this.fetch(selectPage(Pagination.next, response));
  }

  async fetchPrevPage(response) {
    return this.fetch(selectPage(Pagination.prev, response));
  }

  async fetchLastPage(response) {
    return this.fetch(selectPage(Pagination.last, response));
  }
}

module.exports = MBTA;
