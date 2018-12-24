/* eslint-disable indent */
const MBTA = require('../mbta-api');
const { normalizeType, normalizeDate } = require('../mbta');
const includeData = require('./data/includeData');
const { selectPage } = require('../utils');
const { TimeUnits: { MINUTES, MS }, Pagination } = require('../constants');
const {
  predictionData: response,
  limitedPredictionData: limitData,
} = require('./data/predictionData');

describe('helper functions', () => {
  let mbta;
  let fetchService;
  const now = new Date('2018-12-05T20:21:55-05:00').valueOf();

  beforeEach(() => {
    fetchService = jest.fn();
    mbta = new MBTA('fakeApiKey', fetchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('included selects by type', async () => {
    fetchService = jest.fn().mockResolvedValue(includeData);
    mbta = new MBTA(null, fetchService);

    const fetched = await mbta.fetchStops();

    expect(mbta.selectIncluded).toThrowErrorMatchingInlineSnapshot(
      `"included() requires an MBTA response as an argument"`
    );

    expect(mbta.selectIncluded(fetched)).toEqual(includeData.included);
    expect(mbta.selectIncluded(fetched, 'trip')).toEqual(
      includeData.included.filter(({ type }) => type === 'trip')
    );
    expect(mbta.selectIncluded(fetched, ['trip'])).toEqual(
      includeData.included.filter(({ type }) => type === 'trip')
    );
    expect(mbta.selectIncluded(fetched, ['trip', 'route'])).toEqual(
      includeData.included.filter(
        ({ type }) => type === 'trip' || type === 'route'
      )
    );
  });

  describe('normalizeType', () => {
    it.each([
      ['zero', 0, 0],
      ['number', 1, 1],
      ['string number', '1', 1],
      ['trolley', 'trolley', 0],
      ['subway', 'subway', 1],
      ['commuter rail', 'commuter rail', 2],
      ['bus', 'bus', 3],
      ['ferry', 'ferry', 4],
      ['cable car', 'cable car', 5],
      ['gondola', 'gondola', 6],
      ['funicular', 'funicular', 7],
      ['mixed case', 'Funicular', 7],
      ['null', null, null],
      ['undefined', undefined, null],
      ['non-matching string', 'blah', null],
      ['non-matching number', 42, null],
    ])('converts %s type to number', (description, type, expected) => {
      expect(normalizeType(type)).toBe(expected);
    });
  });

  describe('fetch with type edge cases', () => {
    it.each([
      ['string', 'bus', '&type=3'],
      ['array', ['bus', 2], '&type=3,2'],
      ['non-matching string', 'blah', ''],
      ['array with undefined', ['bus', undefined], '&type=3'],
      ['array with non-matching', ['bus', 'blah'], '&type=3'],
    ])('converts %s type to query', async (description, type, expected) => {
      await mbta.fetchPredictions({ stop: 1, type });
      const url = `https://api-v3.mbta.com/predictions?stop=1${expected}&api_key=fakeApiKey`;
      expect(fetchService).toBeCalledWith(url);
    });
  });

  describe('normalizeDate', () => {
    it.each([
      ['timestamp', now, '2018-12-06T01:21:55.000Z'],
      ['new Date()', new Date(now), '2018-12-06T01:21:55.000Z'],
      ['date string', 'June 14, 2018', '2018-06-14T04:00:00.000Z'],
    ])('converts %s to ISO', (description, input, expected) => {
      expect(normalizeDate(input)).toBe(expected);
    });
  });

  describe('multiple queries', () => {
    it.each`
      name                       | queryParams                      | expected
      ${'single route'}          | ${{ route: 1 }}                  | ${'route=1'}
      ${'single route array'}    | ${{ route: [1] }}                | ${'route=1'}
      ${'multi route with null'} | ${{ route: [1, null] }}          | ${'route=1'}
      ${'multi route array'}     | ${{ route: [1, 'Red'] }}         | ${'route=1,Red'}
      ${'multi route csv'}       | ${{ route: '1,2' }}              | ${'route=1,2'}
      ${'removes spaces'}        | ${{ route: '1, 2, 3' }}          | ${'route=1,2,3'}
    `(`handles single or multiple queries: $name`, async ({ queryParams, expected }) => {
      await mbta.fetchPredictions(queryParams);
      const url = `https://api-v3.mbta.com/predictions?${expected}&api_key=fakeApiKey`;
      expect(fetchService).toBeCalledWith(url);
    });
  });

  describe('links', () => {
    it.each([
      ['fetchFirstPage', 0],
      ['fetchNextPage', 3],
      ['fetchPrevPage', 1],
      ['fetchLastPage', 13],
    ])('links: %s', async (fn, offset) => {
      await mbta[fn](limitData);
      const url = `https://api-v3.mbta.com/predictions?filter[stop]=70080&page[limit]=1&page[offset]=${offset}`;
      expect(fetchService).toBeCalledWith(url);
    });

    it('links throws if no predictions provided', async () => {
      expect.assertions(2);
      try {
        await mbta.fetchFirstPage();
      } catch (err) {
        expect(err.message).toMatchInlineSnapshot(
          `"No response, fetch data before accessing this value"`
        );
      }
      expect(fetchService).not.toBeCalled();
    });
  });

  describe('arrivals/departures', () => {
    it('returns empty array if no response', () => {
      expect(mbta.selectArrivals()).toEqual([]);
      expect(mbta.selectDepartures()).toEqual([]);
    });

    it('converts to minutes', () => {
      const arrivals = mbta.selectArrivals(response, { now, convertTo: MINUTES });
      const departures = mbta.selectDepartures(response, { now, convertTo: MINUTES });
      expect(arrivals).toEqual([null, 5, 6, 14, 25, 36, 48, 60]);
      expect(departures).toEqual([0, null, 6, 14, 25, 36, 48, 60]);
    });

    it('converts to MS', () => {
      const arrivals = mbta.selectArrivals(response, { now, convertTo: MS });
      expect(arrivals).toEqual([
        null,
        320000,
        407000,
        898000,
        1554000,
        2214000,
        2934000,
        3654000,
      ]);
      const departures = mbta.selectDepartures(response, { now, convertTo: MS });
      expect(departures).toEqual([
        0,
        null,
        408000,
        899000,
        1555000,
        2215000,
        2935000,
        3655000,
      ]);
    });

    it('selectPage selects the correct page offset', () => {
      expect(selectPage(Pagination.first, limitData)).toMatch('[offset]=0');
      expect(selectPage(Pagination.next, limitData)).toMatch('[offset]=3');
      expect(selectPage(Pagination.prev, limitData)).toMatch('[offset]=1');
      expect(selectPage(Pagination.last, limitData)).toMatch('[offset]=13');
    });

    it('returns arrival ISO times if no convert', () => {
      const arrivals = mbta.selectArrivals(response, { now });
      expect(arrivals).toMatchInlineSnapshot(`
Array [
  null,
  "2018-12-05T20:27:15-05:00",
  "2018-12-05T20:28:42-05:00",
  "2018-12-05T20:36:53-05:00",
  "2018-12-05T20:47:49-05:00",
  "2018-12-05T20:58:49-05:00",
  "2018-12-05T21:10:49-05:00",
  "2018-12-05T21:22:49-05:00",
]
`);
      const departures = mbta.selectDepartures(response, { now });
      expect(departures).toMatchInlineSnapshot(`
Array [
  "2018-12-05T20:21:55-05:00",
  null,
  "2018-12-05T20:28:43-05:00",
  "2018-12-05T20:36:54-05:00",
  "2018-12-05T20:47:50-05:00",
  "2018-12-05T20:58:50-05:00",
  "2018-12-05T21:10:50-05:00",
  "2018-12-05T21:22:50-05:00",
]
`);
    });
  });
});
