const MBTA = require('../MBTA');
const includeData = require('./data/includeData');
const {limitedPredictionData: limitData} = require('./data/predictionData');

describe('helper functions', () => {
  let mbta;

  beforeEach(() => {
    mbta = new MBTA();
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
        `"No predictions, call fetchPredictions() before accessing this value"`
      );
    }
    expect(fetchService).not.toBeCalled();
  });

  it('selects by type', async () => {
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
});
