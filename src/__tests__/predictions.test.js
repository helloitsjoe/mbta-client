const MBTA = require("../MBTA");
const predictions = require("./data/predictionData");
// const util = require('util')

const {
  TimeUnits: { MINUTES, MS }
} = require("../utils");

describe("predictions", () => {
  let mbta;
  const now = new Date("2018-12-05T20:21:55-05:00").valueOf();

  beforeEach(() => {
    mbta = new MBTA();
  });

  it.skip("fetchPredictions", async () => {
    // TODO: Nock
    // const pred = await mbta.fetchPredictions({ routeID: 1 });
    // console.log(util.inspect(pred, {showHidden: false, depth: null}))
  });

  describe("arrivals", () => {
    it("returns empty array if no predictions", () => {
      expect(mbta.arrivals({})).toEqual([]);
    });

    it("returns arriving in minutes", () => {
      const arrivals = mbta.arrivals({ now, predictions, units: MINUTES });
      expect(arrivals).toEqual([null, 5, 6, 14, 25, 36, 48, 60]);
    });

    it("truncates array to max", () => {
      const arrivals = mbta.arrivals({ now, predictions, max: 4, units: MINUTES });
      expect(arrivals).toEqual([null, 5, 6, 14]);
    });

    it("returns arriving in MS", () => {
      const arrivals = mbta.arrivals({ now, predictions, units: MS });
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
    });

    it("returns arrival ISO times if no units", () => {
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
    });
  });

  describe("departures", () => {
    it("returns empty array if no predictions", () => {
      expect(mbta.departures({})).toEqual([]);
    });

    it("returns departures in minutes", () => {
      const departures = mbta.departures({ now, predictions, units: MINUTES });
      expect(departures).toEqual([0, null, 6, 14, 25, 36, 48, 60]);
    });

    it("truncates to max", () => {
      const departures = mbta.departures({ now, predictions, max: 3, units: MINUTES });
      expect(departures).toEqual([0, null, 6]);
    });

    it("returns departures in MS", () => {
      const departures = mbta.departures({ now, predictions, units: MS });
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

    it("returns departure ISO times if no units", () => {
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
  });
});
