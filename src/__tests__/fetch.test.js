// const util = require('util');
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

  // it.only('test live data', async () => {
  //   // Test live data
  //   // const routes = await mbta.fetchRoutes();
  //   // const pred = routes.data.map(ea => ({
  //   //   id: ea.id,
  //   //   abbr: ea.attributes.short_name,
  //   //   name: ea.attributes.long_name,
  //   //   directions: ea.attributes.direction_names,
  //   // }));
  //   const pred = await mbta.fetchSchedules({ route: 71, limit: 2, stop_sequence: 'last' });
  //   console.log(util.inspect(pred, { showHidden: false, depth: null }));
  // });

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
