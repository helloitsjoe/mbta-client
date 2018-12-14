const MBTA = require('../MBTA');
const includeData = require('./data/includeData');

describe('included', () => {
  let mbta;

  beforeEach(() => {
    mbta = new MBTA();
  });

  it('fetchStops', async () => {
    const fetchService = jest.fn().mockResolvedValue(includeData);
    mbta = new MBTA(null, fetchService);
    expect(mbta.included()).toEqual([]);
    const fetched = await mbta.fetchStops();
    expect(mbta.included()).toEqual(includeData.included);
    expect(mbta.included(fetched)).toEqual(includeData.included);
    expect(mbta.included(fetched, 'trip')).toEqual(
      includeData.included.filter(({type}) => type === 'trip')
    );
    expect(mbta.included(fetched, ['trip'])).toEqual(
      includeData.included.filter(({type}) => type === 'trip')
    );
    expect(mbta.included(fetched, ['trip', 'route'])).toEqual(
      includeData.included.filter(({type}) => type === 'trip' || type === 'route')
    );
  });
});
