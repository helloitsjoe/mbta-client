const MBTA = require('../mbta');
const fetchService = require('../fetchService');

const API_KEY = 'fakeApiKey';

describe('MBTA', () => {
  it('initialized WITH api key', async () => {
    const mockService = jest.fn();
    const mbta = new MBTA(API_KEY, mockService);

    await mbta.fetchRoutes();
    expect(mockService).toBeCalledWith(`https://api-v3.mbta.com/routes?api_key=${API_KEY}`);
  });

  it('initialized WITHOUT api key', async () => {
    const mockService = jest.fn();
    const mbta = new MBTA(null, mockService);

    await mbta.fetchRoutes();
    expect(mockService).toBeCalledWith('https://api-v3.mbta.com/routes');
  });

  it('initialized WITHOUT fetchService uses default', async () => {
    const mbta = new MBTA(null);
    expect(mbta.fetch).toEqual(fetchService);
  });
});
