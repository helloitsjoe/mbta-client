# MTBA API Client

`mbta-client` is a JavaScript client for MTBA V3 API, with a few helper functions to parse response data.

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

MBTA API Documentation: https://api-v3.mbta.com/docs/swagger/index.html

MBTA API Best Practices: https://www.mbta.com/developers/v3-api/best-practices
