const MBTA = require("../MBTA");
const predictions = require("./data/predictionData");

const {
  TimeUnits: { MINUTES, MS }
} = require("../utils");

describe("predictions", () => {
  let mbta;
  const now = new Date("2018-12-05T20:21:55-05:00").valueOf();

  beforeEach(() => {
    mbta = new MBTA();
  });

  // it.only('test live data', async () => {
  //   // Test live data
  //   const util = require('util');
  //   const pred = await mbta.fetchPredictions({ stopID: 2056, limit: 1 });
  //   console.log(util.inspect(pred, {showHidden: false, depth: null}));
  // });

  it("fetchPredictions", async () => {
    const fetchService = jest.fn().mockResolvedValue(predictions);
    const mbta = new MBTA(null, fetchService);
    expect(mbta.predictions).toEqual([]);
    const fetched = await mbta.fetchPredictions({});
    expect(fetched).toEqual(predictions);
    expect(mbta.predictions).toEqual(predictions);
  });

  describe("arrivals/departures", () => {
    // arrivals and departures use the same undelying function
    it("returns empty array if no predictions", () => {
      expect(mbta.arrivals({})).toEqual([]);
      expect(mbta.departures({})).toEqual([]);
    });

    it("converts to minutes", () => {
      const arrivals = mbta.arrivals({ now, predictions, convertTo: MINUTES });
      const departures = mbta.departures({
        now,
        predictions,
        convertTo: MINUTES
      });
      expect(arrivals).toEqual([null, 5, 6, 14, 25, 36, 48, 60]);
      expect(departures).toEqual([0, null, 6, 14, 25, 36, 48, 60]);
    });

    it("truncates array to max", () => {
      const arrivals = mbta.arrivals({
        now,
        predictions,
        max: 4,
        convertTo: MINUTES
      });
      const departures = mbta.departures({
        now,
        predictions,
        max: 3,
        convertTo: MINUTES
      });
      expect(arrivals).toEqual([null, 5, 6, 14]);
      expect(departures).toEqual([0, null, 6]);
    });

    it("converts to MS", () => {
      const arrivals = mbta.arrivals({ now, predictions, convertTo: MS });
      expect(arrivals).toEqual([
        null,
        320000,
        407000,
        898000,
        1554000,
        2214000,
        2934000,
        3654000
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
        3655000
      ]);
    });

    it("returns arrival ISO times if no convert", () => {
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

    it("returns arrivals if mbta.predictions exists", async () => {
      const fetchService = jest.fn().mockResolvedValue(predictions);
      const mbta = new MBTA(null, fetchService);
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
