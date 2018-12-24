# MTBA API Client

`mbta-client` is a promise-based Node.js client library for the MTBA API v3, with a few helper functions to parse response data.

## Installation:

```js
npm i mbta-client
```

## Importing

```js
import MBTA from 'mbta-client';
```

## Basic Usage

Instantiate MBTA with your API key

```js
import MBTA from 'mbta-client';

const mbta = new MBTA(YOUR_API_KEY);
```

Fetch predictions, providing at least one filter (`stop`, `route`, or `trip`);

```js
const predictions = await mbta.fetchPredictions({ stop: 42 });
const arrivals = mbta.arrivals({ predictions });
```

You can include arrays of filters for combined results:

```js
// Returns combined predictions for bus route 1 and the red line
const predictions = await mbta.fetchPredictions({ route: [1, 'Red'] });

// Returns combined predictions for stop 70080 and Back Bay commuter rail
const predictions = await mbta.fetchPredictions({ stop: [70080, 'Back Bay'] });
```

Filter by `direction_id` to only get results going in one direction.
`direction_id` corresponds to the index of the `route`'s `direction_names` attribute.
Example: The red line's `direction_names` are `['Southbound', 'Northbound']`, so to return
only Northbound results, include `direction_id: 1` in your query.

```js
const predictions = await mbta.fetchPredictions({ stop: 'place-sstat', direction_id: 1 });
```

Get results based on `latitude`/`longitude`, optionally providing a radius

```js
const predictions = await mbta.fetchPredictions({ latitude: 42.373, longitude: -71.119 });
```

You can limit the number of results, sort by `arrival_time`, `departure_time`, etc., and reverse the sort order with `descending: true`.

```js
const predictions = mbta.fetchPredictions({
  stop: 42,
  limit: 4, // Truncate the number of results
  sort: 'arrival_time', // Sort by `arrival_time`, `departure_time`, etc.
  descending: true, // Set `descending` to true to reverse the sort order.
});
const arrivals = mbta.arrivals({ convertTo: 'MINUTES' });
```

If you need paginated results, provide a `limit` and optional `offset` with the request. Helper functions will return the first, next, previous and last pages.

```js
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
mbta.arrivals({
  response: MBTAResponse;
  convertTo: 'MS' | 'SECONDS' | 'MINUTES' | 'HOURS';
});
mbta.departures(options); // Same options as arrivals
```

```ts
mbta.included({
  response: MBTAResponse,
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
