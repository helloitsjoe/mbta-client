// const util = require('util');
const MBTA = require('../MBTA');
const stopsData = require('./data/stopsData');

describe('stops', () => {
  let mbta;

  beforeEach(() => {
    mbta = new MBTA();
  });

  // it.only('test live data', async () => {
  //   // Test live data
  //   // TODO: Page offset
  //   // TODO: Page limit
  //   const pred = await mbta.fetchStops({ limit: 3 });
  //   console.log(util.inspect(pred, { showHidden: false, depth: null }));
  // });

  it('fetchStops', async () => {
    const fetchService = jest.fn().mockResolvedValue(stopsData);
    mbta = new MBTA(null, fetchService);
    expect(mbta.stops).toEqual([]);
    const fetched = await mbta.fetchStops();
    expect(fetched).toEqual(stopsData);
    expect(mbta.predictions).toEqual(stopsData);
  });
});
