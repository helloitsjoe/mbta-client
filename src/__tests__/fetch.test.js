const MBTA = require('../mbta-api');
const stopsData = require('./data/stopsData');
const tripsData = require('./data/tripsData');
const routesData = require('./data/routesData');
const shapesData = require('./data/shapesData');
const servicesData = require('./data/servicesData');
const vehiclesData = require('./data/vehiclesData');
const schedulesData = require('./data/schedulesData');
const { predictionData } = require('./data/predictionData');

describe('stops', () => {
  let mbta;

  beforeEach(() => {
    mbta = new MBTA();
  });

  it.each([
    ['fetchStops', stopsData, 'stops'],
    ['fetchTrips', tripsData, 'trips'],
    ['fetchRoutes', routesData, 'routes'],
    ['fetchShapes', shapesData, 'shapes'],
    ['fetchVehicles', vehiclesData, 'vehicles'],
    ['fetchServices', servicesData, 'services'],
    ['fetchSchedules', schedulesData, 'schedules'],
    ['fetchPredictions', predictionData, 'predictions'],
  ])('%s', async (methodName, data, property) => {
    const fetchService = jest.fn().mockResolvedValue(data);
    mbta = new MBTA(null, fetchService);
    expect(mbta[property]).toEqual([]);

    const fetched = await mbta[methodName]({});

    expect(fetched).toEqual(data);
    expect(mbta[property]).toEqual(data);
  });
});
