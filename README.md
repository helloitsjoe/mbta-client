# MTBA API Client

`mbta-client` is a promise-based Node.js client library for the MTBA API v3, with a few helper functions to parse response data.

[![Build Status](https://travis-ci.com/helloitsjoe/mbta-client.svg?branch=master)](https://travis-ci.com/helloitsjoe/mbta-client)
[![Coverage Status](https://coveralls.io/repos/github/helloitsjoe/mbta-client/badge.svg?branch=master)](https://coveralls.io/github/helloitsjoe/mbta-client?branch=master)
[![NPM Version](https://img.shields.io/npm/v/mbta-client.svg?color=lightgray)](https://www.npmjs.com/package/mbta-client)

## Installation:

```js
npm i mbta-client
```

## Basic Usage

### Fetch functions

```js
import MBTA from 'mbta-client';

// Instantiate MBTA with your API key
const mbta = new MBTA(YOUR_API_KEY);

// Fetch data, passing filters as options. Filter documentation for
// each function: https://api-v3.mbta.com/docs/swagger/index.html#/
const predictions = await mbta.fetchPredictions({ stop: 42 });

// Use an array for filters that accept multiple values
const stops = await mbta.fetchStops({ id: [70080, 'Back Bay'] });

// Some fetch functions accept a `type` or `route_type` filter. This can
// be provided as a string ('bus', 'subway', etc.) or route_type code:
// https://developers.google.com/transit/gtfs/reference/routes-file
const subwayRoutes = await mbta.fetchRoutes({ type: 'subway' });

// Filter by `direction_id` to only get results going in one direction.
// `direction_id` maps to the index of the route's `direction_names`.
// Example: Red line `direction_names` are `['South', 'North']`.
// Include `direction_id: 1` in options for Northbound results.
const north = await mbta.fetchPredictions({ route: 'Red', direction_id: 1 });

// Get results based on `latitude`/`longitude`, and optional `radius`.
const local = await mbta.fetchStops({ latitude: 42.373, longitude: -71.119 });

// Sort by `arrival_time`, `departure_time`, etc. See MBTA docs for each
// endpoint's sort options. `descending: true` will reverse sort order.
const sorted = await mbta.fetchPredictions({
  stop: 42,
  sort: 'arrival_time',
  descending: true,
});

// Alerts have a number of extra filters. See MBTA docs for best practices.
const alerts = await mbta.fetchAlerts({
  sort: 'cause',
  activity: 'BOARD',
  datetime: 'NOW',
  severity: [2, 3],
});
```

### Helper functions:

#### Arrivals/Departures

_Note: arrival and departure helpers have the same API/options._

```js
// By default, returns an array of arrival times in ISO8601 format
const arr = mbta.selectArrivals(response);
// `convertTo` returns time left in ms, seconds, minutes, hours
const dep = mbta.selectDepartures(response, { convertTo: 'minutes' });
```

#### Fetch Helpers

```js
// Returns basic info for all routes: name, ID, direction names.
// Useful when you need params for `fetchPredictions`, etc.
const allRouteInfo = await mbta.fetchAllRoutes();
console.log(allRouteInfo);

// Returns all stop IDs for the provided route. Also useful for params.
const redLineStops = await mbta.fetchStopsByRoute('Red');
console.log(redLineStops);

// Returns full MBTA response for stops with the provided string in the name.
// Optional param `{ exact: true }` returns only exact matches for the name.
const harvardStops = await mbta.fetchStopsByName('Harvard', { exact: true });
console.log(harvardStops);
```

#### Pagination

Helper functions fetch the first, next, previous and last pages.

```js
// For paginated results, provide `limit` and optional `offset`
const results = await mbta.fetchPredictions({ stop: 42, limit: 2 });

// Use the result to fetch the next page
const secondPageResults = await mbta.fetchNextPage(results);
// Use the next page result to fetch the page after that
const thirdPageResults = await mbta.fetchNextPage(secondPageResults);
// Fetch first or last page from any result
const firstPageResults = await mbta.fetchFirstPage(results);
const lastPageResults = await mbta.fetchLastPage(results);
```

## API

### Fetch functions

These map to the endpoints listed in [the MBTA docs](https://api-v3.mbta.com/docs/swagger/index.html). They return a promise that resolves to an MBTA response object. `options` for each function maps to the filters listed on that page. `options` that accept multiple values can be provided as an array or comma separated string.

```js
mbta.fetchStops(options);
mbta.fetchTrips(options);
mbta.fetchRoutes(options);
mbta.fetchShapes(options);
mbta.fetchVehicles(options);
mbta.fetchServices(options);
mbta.fetchSchedules(options);
mbta.fetchFacilities(options);
mbta.fetchPredictions(options);
mbta.fetchLiveFacilities(options);

mbta.fetchAlerts(options); // See note on alerts below
```

The MBTA docs say: "Displaying alerts is one of the trickiest features to get correct." See their [best practices](https://www.mbta.com/developers/v3-api/best-practices) and the [alerts API docs](https://api-v3.mbta.com/docs/swagger/index.html#/Alert/ApiWeb_AlertController_index) for more information.

### Helper functions

```ts
mbta.selectArrivals(response: MBTAResponse, options?: TimeOptions);
mbta.selectDepartures(response: MBTAResponse, options?: TimeOptions);

type TimeOptions = { convertTo?: 'ms' | 'seconds' | 'minutes' | 'hours' };
```

_Note: `arrival_time` could be null if it's the first stop on a route. If `departure_time` is not null, the MBTA recommends using that instead. Departure could be null if it's the final stop on a route. See [best practices](https://www.mbta.com/developers/v3-api/best-practices) for more info._

```ts
mbta.fetchAllRoutes(filters?: TypeOptions): Promise<BasicRouteResponse>;
mbta.fetchStopsByRoute(routeID: string|number): Promise<StopsByRouteResponse>;
mbta.fetchStopsByName(name: string, opts: NameOptions): Promise<MBTAResponse>;

mbta.selectIncluded(response: MBTAResponse, options?: TypeOptions);

type BasicRouteResponse = {
  id: string,
  long_name: string,
  direction_names: string[],
  short_name?: string
};
type StopsByRouteResponse = { name: string, id: string };
type TypeOptions = { type?: include_value | include_value[] };
type NameOptions = { exact: boolean };
```

_See the [MBTA API docs](https://api-v3.mbta.com/docs/swagger/index.html) for `include_value` options for each endpoint_

### Pagination helpers

(These return a promise that resolves to an MBTA response object)

_Note: Input must include `links` property._

```ts
mbta.fetchFirstPage(response: MBTAResponse);
mbta.fetchLastPage(response: MBTAResponse);
mbta.fetchNextPage(response: MBTAResponse);
mbta.fetchPrevPage(response: MBTAResponse);
```

MBTA API Documentation: https://api-v3.mbta.com/docs/swagger/index.html

MBTA API Best Practices: https://www.mbta.com/developers/v3-api/best-practices

_Note: This library is not affiliated with the MBTA or MassDOT._

## License

MIT
