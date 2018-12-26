/* eslint-disable indent */
const MBTA = require('../mbta');
const { normalizeType, normalizeDate, convertMs } = require('../utils');
const { selectPage } = require('../selectors');
const { Pagination } = require('../constants');
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
      ['cable car', 'cable car', 6],
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
      name                       | queryParams              | expected
      ${'single route'}          | ${{ route: 1 }}          | ${'route=1'}
      ${'single route array'}    | ${{ route: [1] }}        | ${'route=1'}
      ${'multi route with null'} | ${{ route: [1, null] }}  | ${'route=1'}
      ${'multi route array'}     | ${{ route: [1, 'Red'] }} | ${'route=1,Red'}
      ${'multi route csv'}       | ${{ route: '1,2' }}      | ${'route=1,2'}
      ${'removes spaces'}        | ${{ route: '1, 2, 3' }}  | ${'route=1,2,3'}
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

  describe('convertTo', () => {
    const ONE_HOUR = 3600000;
    const ONE_MIN = 60000;

    // Test different cases, should be case insensitive
    it.each([
      ['', ONE_MIN, 60000],
      ['ms', ONE_MIN, 60000],
      ['milliseconds', ONE_MIN, 60000],
      ['sec', ONE_MIN, 60],
      ['Secs', ONE_MIN, 60],
      ['SECONDS', ONE_MIN, 60],
      ['min', ONE_MIN, 1],
      ['mins', ONE_MIN, 1],
      ['minutes', ONE_MIN, 1],
      ['Hr', ONE_HOUR, 1],
      ['HRS', ONE_HOUR, 1],
      ['Hours', ONE_HOUR, 1],
      [null, ONE_MIN, 60000],
    ])('%s', (convertTo, inputMS, output) => {
      const actual = convertMs(inputMS, convertTo);
      expect(actual).toEqual(output);
    });

    it.each([
      [0, ONE_HOUR],
      [6, ONE_HOUR],
      ['blah', ONE_HOUR],
      ['secondshours', ONE_HOUR],
      ['milli seconds', ONE_HOUR],
    ])('invalid convertTo value throws', (convertTo, inputMS) => {
      expect.assertions(1);
      try {
        convertMs(inputMS, convertTo);
      } catch (error) {
        expect(error.message).toBe(`Invalid 'convertTo' value: ${convertTo}`);
      }
    });
  });

  describe('arrivals/departures', () => {
    it('returns empty array if no response', () => {
      expect(mbta.selectArrivals()).toEqual([]);
      expect(mbta.selectDepartures()).toEqual([]);
    });

    it('convertTo works as expected', () => {
      const arrivals = mbta.selectArrivals(response, { now, convertTo: 'minutes' });
      const departures = mbta.selectDepartures(response, { now, convertTo: 'mins' });
      expect(arrivals).toEqual([null, 5, 6, 14, 25, 36, 48, 60]);
      expect(departures).toEqual([0, null, 6, 14, 25, 36, 48, 60]);
    });

    it('selectPage selects the correct page offset', () => {
      expect(selectPage(Pagination.first, limitData)).toMatch('[offset]=0');
      expect(selectPage(Pagination.next, limitData)).toMatch('[offset]=3');
      expect(selectPage(Pagination.prev, limitData)).toMatch('[offset]=1');
      expect(selectPage(Pagination.last, limitData)).toMatch('[offset]=13');
    });

    it('returns arrival ISO times if no convertTo', () => {
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
