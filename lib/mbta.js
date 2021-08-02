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
  constructor(apiKey, fetch = fetchService, logger = console) {
    this.apiKey = apiKey;
    this.fetch = fetch;
    this.logger = logger;
  }

  /**
   * Fetch functions
   */
  async fetchAlerts(queryParams) {
    return this.fetch(buildUrl('/alerts', queryParams, this.apiKey, this.logger));
  }

  async fetchFacilities(queryParams) {
    return this.fetch(buildUrl('/facilities', queryParams, this.apiKey, this.logger));
  }

  async fetchLiveFacilities(queryParams) {
    return this.fetch(buildUrl('/live-facilities', queryParams, this.apiKey, this.logger));
  }

  async fetchPredictions(queryParams) {
    return this.fetch(buildUrl('/predictions', queryParams, this.apiKey, this.logger));
  }

  async fetchRoutes(queryParams) {
    return this.fetch(buildUrl('/routes', queryParams, this.apiKey, this.logger));
  }

  async fetchSchedules(queryParams) {
    return this.fetch(buildUrl('/schedules', queryParams, this.apiKey, this.logger));
  }

  async fetchServices(queryParams) {
    return this.fetch(buildUrl('/services', queryParams, this.apiKey, this.logger));
  }

  async fetchShapes(queryParams) {
    return this.fetch(buildUrl('/shapes', queryParams, this.apiKey, this.logger));
  }

  async fetchStops(queryParams) {
    return this.fetch(buildUrl('/stops', queryParams, this.apiKey, this.logger));
  }

  async fetchTrips(queryParams) {
    return this.fetch(buildUrl('/trips', queryParams, this.apiKey, this.logger));
  }

  async fetchVehicles(queryParams) {
    return this.fetch(buildUrl('/vehicles', queryParams, this.apiKey, this.logger));
  }

  /**
   * Fetch helper functions
   */
  async fetchAllRoutes(filters) {
    // Example: filter by { type: 3 } to get all bus routes
    const routes = await this.fetchRoutes(filters);
    return routes.data.map(route => {
      const { short_name } = route.attributes;
      // Only include short_name if it exists and is different from `id`
      const maybeAbbr =
        short_name && short_name !== route.id ? { short_name } : {};
      return {
        ...maybeAbbr,
        id: route.id,
        long_name: route.attributes.long_name,
        direction_names: route.attributes.direction_names,
      };
    });
  }

  async fetchStopsByRoute(route) {
    const stops = await this.fetchStops({ route });
    return stops.data.map(stop => ({
      name: stop.attributes.name,
      id: stop.id,
    }));
  }

  async fetchStopsByName(name, { exact } = {}) {
    const allStops = await this.fetchStops();
    const normalizedName = name.trim().toLowerCase();
    return allStops.data.filter(stop => {
      if (exact) {
        return stop.attributes.name.toLowerCase() === normalizedName;
      }
      return stop.attributes.name.toLowerCase().match(normalizedName);
    });
  }

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
