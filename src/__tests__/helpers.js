/* eslint-disable indent */
const MBTA = require('../mbta-api');
const { selectPage, Pages } = require('../utils');

const {
  predictionData: response,
  limitedPredictionData: limitData,
} = require('./data/predictionData');
const includeData = require('./data/includeData');

const {TimeUnits: { MINUTES, MS }} = require('../utils');

describe('helper functions', () => {
  let mbta;
  const now = new Date('2018-12-05T20:21:55-05:00').valueOf();

  beforeEach(() => {
    mbta = new MBTA();
  });

  it.each`
    name                      | queryParams                      | expected
    ${'single route'}         | ${{ route: 1 }}                  | ${'1'}
    ${'single route array'}   | ${{ route: [1] }}                | ${'1'}
    ${'multi route array'}    | ${{ route: [1, 'Red'] }}         | ${'1,Red'}
  `(`handles single or multiple queries: $name`, async ({ queryParams, expected }) => {
    const fetchService = jest.fn();
    mbta = new MBTA(null, fetchService);
    await mbta.fetchPredictions(queryParams);
    const filter = Object.keys(queryParams)[0];
    const url = `https://api-v3.mbta.com/predictions?${filter}=${expected}`;
    expect(fetchService).toBeCalledWith(url);
  });

  it.each([
    ['getFirstPage', 0],
    ['getNextPage', 3],
    ['getPrevPage', 1],
    ['getLastPage', 13],
  ])('links: %s', async (fn, offset) => {
    const fetchService = jest.fn();
    mbta = new MBTA(null, fetchService);
    await mbta[fn](limitData);
    const url = `https://api-v3.mbta.com/predictions?filter[stop]=70080&page[limit]=1&page[offset]=${offset}`;
    expect(fetchService).toBeCalledWith(url);
  });

  it('links throws if no predictions provided', async () => {
    expect.assertions(2);
    const fetchService = jest.fn();
    mbta = new MBTA(null, fetchService);
    try {
      await mbta.getFirstPage();
    } catch (err) {
      expect(err.message).toMatchInlineSnapshot(
        `"No response, fetch data before accessing this value"`
      );
    }
    expect(fetchService).not.toBeCalled();
  });

  it('included selects by type', async () => {
    const fetchService = jest.fn().mockResolvedValue(includeData);
    mbta = new MBTA(null, fetchService);

    const fetched = await mbta.fetchStops();

    expect(mbta.included).toThrowErrorMatchingInlineSnapshot(
      `"included() requires an MBTA response as an argument"`
    );

    expect(mbta.included(fetched)).toEqual(includeData.included);
    expect(mbta.included(fetched, 'trip')).toEqual(
      includeData.included.filter(({ type }) => type === 'trip')
    );
    expect(mbta.included(fetched, ['trip'])).toEqual(
      includeData.included.filter(({ type }) => type === 'trip')
    );
    expect(mbta.included(fetched, ['trip', 'route'])).toEqual(
      includeData.included.filter(
        ({ type }) => type === 'trip' || type === 'route'
      )
    );
  });

  describe('arrivals/departures', () => {
    it('returns empty array if no response', () => {
      expect(mbta.arrivals({})).toEqual([]);
      expect(mbta.departures({})).toEqual([]);
    });

    it('converts to minutes', () => {
      const arrivals = mbta.arrivals({ now, response, convertTo: MINUTES });
      const departures = mbta.departures({ now, response, convertTo: MINUTES });
      expect(arrivals).toEqual([null, 5, 6, 14, 25, 36, 48, 60]);
      expect(departures).toEqual([0, null, 6, 14, 25, 36, 48, 60]);
    });

    it('converts to MS', () => {
      const arrivals = mbta.arrivals({ now, response, convertTo: MS });
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
      const departures = mbta.departures({ now, response, convertTo: MS });
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
      expect(selectPage(Pages.first, limitData)).toMatch('[offset]=0');
      expect(selectPage(Pages.next, limitData)).toMatch('[offset]=3');
      expect(selectPage(Pages.prev, limitData)).toMatch('[offset]=1');
      expect(selectPage(Pages.last, limitData)).toMatch('[offset]=13');
    });

    it('returns arrival ISO times if no convert', () => {
      const arrivals = mbta.arrivals({ now, response });
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
      const departures = mbta.departures({ now, response });
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

    it('returns arrivals if mbta.predictions exists', async () => {
      const fetchService = jest.fn().mockResolvedValue(response);
      mbta = new MBTA(null, fetchService);
      expect(mbta.arrivals()).toEqual([]);
      expect(mbta.departures()).toEqual([]);

      await mbta.fetchPredictions({});

      expect(mbta.arrivals()).toMatchInlineSnapshot(`
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
      expect(mbta.departures()).toMatchInlineSnapshot(`
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
