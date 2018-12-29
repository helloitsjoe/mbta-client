const MBTA = require('../mbta');
const stopsData = require('./data/stopsData');
const tripsData = require('./data/tripsData');
const routesData = require('./data/routesData');
const alertsData = require('./data/alertsData');
const shapesData = require('./data/shapesData');
const servicesData = require('./data/servicesData');
const vehiclesData = require('./data/vehiclesData');
const schedulesData = require('./data/schedulesData');
const facilitiesData = require('./data/facilitiesData');
const { predictionData } = require('./data/predictionData');

const API_KEY = 'fake';

// // Uncomment to test live data
// // eslint-disable-next-line
// const util = require('util');
// it.only('test live data', async () => {
//   const mbta = new MBTA();
//   const pred = await mbta.fetchAlerts({ limit: 3, banner: 'kiki' });
//   console.log(util.inspect(pred, { showHidden: false, depth: null }));
// });

describe('stops', () => {
  it.each([
    ['fetchStops', stopsData, '/stops'],
    ['fetchTrips', tripsData, '/trips'],
    ['fetchAlerts', alertsData, '/alerts'],
    ['fetchRoutes', routesData, '/routes'],
    ['fetchShapes', shapesData, '/shapes'],
    ['fetchVehicles', vehiclesData, '/vehicles'],
    ['fetchServices', servicesData, '/services'],
    ['fetchSchedules', schedulesData, '/schedules'],
    ['fetchFacilities', facilitiesData, '/facilities'],
    ['fetchPredictions', predictionData, '/predictions'],
  ])('%s', async (methodName, data, endpoint) => {
    const fetchService = jest.fn().mockResolvedValue(data);
    const mbta = new MBTA(API_KEY, fetchService);

    const fetched = await mbta[methodName]({});
    expect(fetchService).toBeCalledWith(`https://api-v3.mbta.com${endpoint}?api_key=fake`);

    expect(fetched).toEqual(data);
  });
});
