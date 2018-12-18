// const util = require('util');

/* eslint-disable indent */
const MBTA = require('../mbta-api');
const { selectPage, Pages } = require('../predictions');
const {
  predictionData: predictions,
  limitedPredictionData: limitData,
} = require('./data/predictionData');

const {TimeUnits: { MINUTES, MS }} = require('../utils');

describe('predictions', () => {
  let mbta;
  const now = new Date('2018-12-05T20:21:55-05:00').valueOf();

  beforeEach(() => {
    mbta = new MBTA();
  });

  // it.only('test live data', async () => {
  //   // Test live data
  //   // const routes = await mbta.fetchRoutes();
  //   // const pred = routes.data.map(ea => ({
  //   //   id: ea.id,
  //   //   abbr: ea.attributes.short_name,
  //   //   name: ea.attributes.long_name,
  //   //   directions: ea.attributes.direction_names,
  //   // }));
  //   const pred = await mbta.fetchShapes({ route: 71, limit: 2 });
  //   console.log(util.inspect(pred, { showHidden: false, depth: null }));
  // });

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

  describe('arrivals/departures', () => {
    it('returns empty array if no predictions', () => {
      expect(mbta.arrivals({})).toEqual([]);
      expect(mbta.departures({})).toEqual([]);
    });

    it('converts to minutes', () => {
      const arrivals = mbta.arrivals({ now, predictions, convertTo: MINUTES });
      const departures = mbta.departures({
        now,
        predictions,
        convertTo: MINUTES,
      });
      expect(arrivals).toEqual([null, 5, 6, 14, 25, 36, 48, 60]);
      expect(departures).toEqual([0, null, 6, 14, 25, 36, 48, 60]);
    });

    it('converts to MS', () => {
      const arrivals = mbta.arrivals({ now, predictions, convertTo: MS });
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
      const departures = mbta.departures({ now, predictions, convertTo: MS });
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
      const arrivals = mbta.arrivals({ now, predictions });
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
      const departures = mbta.departures({ now, predictions });
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
      const fetchService = jest.fn().mockResolvedValue(predictions);
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
