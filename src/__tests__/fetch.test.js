const MBTA = require('../MBTA');
const stopsData = require('./data/stopsData');
const routesData = require('./data/routesData');
const vehiclesData = require('./data/vehiclesData');
const { predictionData } = require('./data/predictionData');

describe('stops', () => {
  let mbta;

  beforeEach(() => {
    mbta = new MBTA();
  });

  it.each([
    ['fetchPredictions', predictionData, 'predictions'],
    ['fetchStops', stopsData, 'stops'],
    ['fetchRoutes', routesData, 'routes'],
    ['fetchVehicles', vehiclesData, 'vehicles'],
  ])('%s', async (methodName, data, property) => {
    const fetchService = jest.fn().mockResolvedValue(data);
    mbta = new MBTA(null, fetchService);
    expect(mbta[property]).toEqual([]);

    const fetched = await mbta[methodName]({});

    expect(fetched).toEqual(data);
    expect(mbta[property]).toEqual(data);
  });
});
