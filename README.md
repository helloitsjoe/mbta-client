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

// Fetch data, passing in filters as options. The MBTA site has documentation
// on filters for each method https://api-v3.mbta.com/docs/swagger/index.html#/
const predictions = await mbta.fetchPredictions({ stop: 42 });

// Filters that accept multiple values can be provided as an array or
// comma separated string, and will return the combined info
const stops = await mbta.fetchStops({ id: [70080, 'Back Bay'] });

// Filter by `direction_id` to only get results going in one direction.
// `direction_id` corresponds to the index of the `route`'s `direction_names` attribute.
// Example: The red line's `direction_names` are `['Southbound', 'Northbound']`,
// so to return only Northbound results, include `direction_id: 1` in your query.
const predictions = await mbta.fetchPredictions({ stop: 'place-sstat', direction_id: 1 });

// Get results based on `latitude`/`longitude`, optionally providing a radius
const predictions = await mbta.fetchPredictions({ latitude: 42.373, longitude: -71.119 });

// You can sort by `arrival_time`, `departure_time`, etc. (See the MBTA docs for
// each endpoint's sort options). Reverse the sort order with { descending: true }.
const predictions = mbta.fetchPredictions({
  stop: 42,
  sort: 'arrival_time',
  descending: true,
});
```

### Helper functions:

#### `selectArrivals`/`selectDepartures`

```js
// By default, returns an array of arrival times in ISO8601 format
const arrivals = mbta.selectArrivals(response);
// Provide `convertTo` option to convert to MINUTES, SECONDS, MS, or HOURS until arrival
const departures = mbta.selectselectDepartures(response, { convertTo: mbta.constants.MINUTES });

```

#### Pagination

```js
// If you need paginated results, provide a `limit` and optional `offset` with the
// request. Helper functions will return the first, next, previous and last pages.
const predictions = await mbta.fetchPredictions({ stop: 42, limit: 2 });

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
```ts
mbta.fetchPredictions(options);
mbta.fetchStops(options);
mbta.fetchTrips(options);
mbta.fetchRoutes(options);
mbta.fetchVehicles(options);
mbta.fetchShapes(options);
mbta.fetchServices(options);
mbta.fetchSchedules(options);
mbta.fetchFacilities(options);
```
`options` for each endpoint map to the filters listed at https://api-v3.mbta.com/docs/swagger/index.html.
`options` that accept multiple values can be provided as an array or comma separated string.
`route_type` can be provided as a [route_type code](https://developers.google.com/transit/gtfs/reference/routes-file) or a string, e.g. `bus`, `subway`, `commuter rail`.

### Helper functions:

```ts
mbta.selectArrivals(response: MBTAResponse; {
  convertTo: mbta.timeConstants; // MS | SECONDS | MINUTES | HOURS
});
mbta.selectDepartures(response, options); // Same options as arrivals
```

```ts
mbta.selectIncluded(response: MBTAResponse, {
  type?: string | string[],
});
```

## Pagination helpers (return a promise):

_Note: Response input must include links._
```ts
mbta.fetchFirstPage(response: MBTAResponse);
mbta.fetchLastPage(response: MBTAResponse);
mbta.fetchNextPage(response: MBTAResponse);
mbta.fetchPrevPage(response: MBTAResponse);
```

MBTA API Documentation: https://api-v3.mbta.com/docs/swagger/index.html

MBTA API Best Practices: https://www.mbta.com/developers/v3-api/best-practices
