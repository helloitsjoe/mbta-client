const MBTA = require('../mbta');
const stopsData = require('./data/stopsData');
const tripsData = require('./data/tripsData');
const routesData = require('./data/routesData');
const shapesData = require('./data/shapesData');
const servicesData = require('./data/servicesData');
const vehiclesData = require('./data/vehiclesData');
const schedulesData = require('./data/schedulesData');
const facilitiesData = require('./data/facilitiesData');
const { predictionData } = require('./data/predictionData');

const API_KEY = 'fakeApiKey';

// Uncomment to test live data
// eslint-disable-next-line
const util = require('util');
it.only('test live data', async () => {
  const mbta = new MBTA();
  const pred = await mbta.fetchStops({ id: 'Back Bay' });
  console.log(util.inspect(pred, { showHidden: false, depth: null }));
});

describe('stops', () => {
  it.each([
    ['fetchStops', stopsData],
    ['fetchTrips', tripsData],
    ['fetchRoutes', routesData],
    ['fetchShapes', shapesData],
    ['fetchVehicles', vehiclesData],
    ['fetchServices', servicesData],
    ['fetchSchedules', schedulesData],
    ['fetchFacilities', facilitiesData],
    ['fetchPredictions', predictionData],
  ])('%s', async (methodName, data) => {
    const fetchService = jest.fn().mockResolvedValue(data);
    const mbta = new MBTA(API_KEY, fetchService);

    const fetched = await mbta[methodName]({});

    expect(fetched).toEqual(data);
  });
});
