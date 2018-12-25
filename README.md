# MTBA API Client

`mbta-client` is a promise-based Node.js client library for the MTBA API v3, with a few helper functions to parse response data.

## Installation:

```js
npm i mbta-client
```

## Basic Usage

### Fetch functions:

```js
import MBTA from 'mbta-client';

// Instantiate MBTA with your API key
const mbta = new MBTA(YOUR_API_KEY);

// Fetch data, passing filters as options. Filter documentation for
// each function: https://api-v3.mbta.com/docs/swagger/index.html#/
const predictions = await mbta.fetchPredictions({ stop: 42 });

// Use an array for filters that accept multiple values
const stops = await mbta.fetchStops({ id: [70080, 'Back Bay'] });

// Some fetch functions accept a `route_type` filter. This can be
// provided as a string ('bus', 'subway', etc.) or route_type code:
// https://developers.google.com/transit/gtfs/reference/routes-file
const subwayRoutes = await mbta.fetchRoutes({ route_type: 'subway' });

// Filter by `direction_id` to only get results going in one direction.
// `direction_id` maps to the index of the route's `direction_names`.
// Example: Red line `direction_names` are `['Southbound', 'Northbound']`.
// Include `direction_id: 1` in options for Northbound results.
const northbound = await mbta.fetchPredictions({
  stop: 'place-sstat',
  direction_id: 1,
});

// Get results based on `latitude`/`longitude`, and optional `radius`.
const local = await mbta.fetchPredictions({
  latitude: 42.373,
  longitude: -71.119,
});

// Sort by `arrival_time`, `departure_time`, etc. See MBTA docs for each
// endpoint's sort options. `descending: true` will reverse sort order.
const sorted = mbta.fetchPredictions({
  stop: 42,
  sort: 'arrival_time',
  descending: true,
});
```

### Helper functions:

#### Arrivals/Departures

```js
// By default, returns an array of arrival times in ISO8601 format
const arrivals = mbta.selectArrivals(response);
// `convertTo` returns time left in ms, seconds, minutes, hours
const departures = mbta.selectselectDepartures(response, {
  convertTo: 'minutes',
});
```

_Arrival and departure helpers have the same API/options._

#### Pagination

```js
// For paginated results, provide `limit` and optional `offset`
const predictions = await mbta.fetchPredictions({ stop: 42, limit: 2 });

// Helper functions fetch the first, next, previous and last pages.
// Use the result to get the next page
const nextPageResults = await mbta.getNextPage(predictions);
// Use the next page result to get the page after that
const nextNextPageResults = await mbta.getNextPage(nextPageResults);
// Get first or last page from any result
const firstPageResults = await mbta.getFirstPage(predictions);
const lastPageResults = await mbta.getLastPage(predictions);
```

## API

### Fetch functions (return a promise):

These map to the endpoints listed at https://api-v3.mbta.com/docs/swagger/index.html. They return a promise that resolves to an MBTA response object. `options` for each function maps to the filters listed on that page. `options` that accept multiple values can be provided as an array or comma separated string.

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
```

### Helper functions:

```ts
mbta.selectArrivals(response: MBTAResponse, options?: ConvertOptions);
mbta.selectDepartures(response: MBTAResponse, options?: ConvertOptions);

type ConvertOptions = { convertTo?: string }; // 'ms', 'seconds', 'minutes', 'hours'
```

_Note: `arrival_time` could be null if it's the first stop on a route. If `departure_time` is not null, the MBTA recommends using that instead. Departure could be null if it's the final stop on a route. See https://www.mbta.com/developers/v3-api/best-practices for more info._

```ts
mbta.selectIncluded(response: MBTAResponse, options?: TypeOptions);

// See the MBTA API docs for `include_value` options for each endpoint
// https://api-v3.mbta.com/docs/swagger/index.html
type TypeOptions = { type?: include_value | include_value[] };
```

## Pagination helpers (return a promise):

_Note: Response input must include `links` property._

```ts
mbta.fetchFirstPage(response: MBTAResponse);
mbta.fetchLastPage(response: MBTAResponse);
mbta.fetchNextPage(response: MBTAResponse);
mbta.fetchPrevPage(response: MBTAResponse);
```

MBTA API Documentation: https://api-v3.mbta.com/docs/swagger/index.html

MBTA API Best Practices: https://www.mbta.com/developers/v3-api/best-practices

## License

MIT
