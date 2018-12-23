# MTBA API Client

`mbta-client` is a Node.js client library for the MTBA API v3, with a few helper functions to parse response data.

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

### Fetch functions:
```ts
mbta.fetchPredictions(options);

// options
{
  route: string | number | string[] | number[];
  trip: string | number | string[] | number[];
  stop: string | number | string[] | number[];
  ...
}
```

### Helper functions:

```ts
mbta.arrivals(options);
mbta.departures(options);

// options
{
  response: MBTAResponse ;// Optional if predictions previously fetched
  convertTo: 'MS' | 'SECONDS' | 'MINUTES' | 'HOURS';
}
```

```ts
mbta.included(response: MBTAResponse, type?: string | string[]);
```

```ts
mbta.getFirstPage(response: MBTAResponse); // Response must include 'links'
mbta.getLastPage(response: MBTAResponse); // Response must include 'links'
mbta.getNextPage(response: MBTAResponse); // Response must include 'links'
mbta.getPrevPage(response: MBTAResponse); // Response must include 'links'
```

MBTA API Documentation: https://api-v3.mbta.com/docs/swagger/index.html

MBTA API Best Practices: https://www.mbta.com/developers/v3-api/best-practices
