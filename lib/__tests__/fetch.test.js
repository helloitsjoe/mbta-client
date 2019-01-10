const MBTA = require('../mbta');
const tripsData = require('./data/tripsData');
const alertsData = require('./data/alertsData');
const shapesData = require('./data/shapesData');
const servicesData = require('./data/servicesData');
const vehiclesData = require('./data/vehiclesData');
const schedulesData = require('./data/schedulesData');
const facilitiesData = require('./data/facilitiesData');
const { predictionData } = require('./data/predictionData');
const { routesData, routesDataBasic } = require('./data/routesData');
const { stopsData, stopsDataByRouteId } = require('./data/stopsData');
// Could not get live facilities data on MBTA site,
// not clear what the shape of the data is
const liveFacilitiesData = 'test';

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
    ['fetchLiveFacilities', liveFacilitiesData, '/live-facilities'],
    ['fetchPredictions', predictionData, '/predictions'],
  ])('%s', async (methodName, data, endpoint) => {
    const fetchService = jest.fn().mockResolvedValue(data);
    const mbta = new MBTA(API_KEY, fetchService);

    const fetched = await mbta[methodName]({});
    expect(fetchService).toBeCalledWith(
      `https://api-v3.mbta.com${endpoint}?api_key=${API_KEY}`
    );

    expect(fetched).toEqual(data);
  });

  it('fetchAllRoutesBasic', async () => {
    const fetchService = jest.fn().mockResolvedValue(routesData);
    const mbta = new MBTA(API_KEY, fetchService);
    const fetched = await mbta.fetchAllRoutes();

    expect(fetched).toEqual(routesDataBasic);
    expect(fetchService).toBeCalledWith(
      'https://api-v3.mbta.com/routes?api_key=fake'
    );
    jest.clearAllMocks();

    // test that options are included in API call;
    await mbta.fetchAllRoutes({ type: 3 });
    expect(fetchService).toBeCalledWith(
      `https://api-v3.mbta.com/routes?type=3&api_key=${API_KEY}`
    );
  });

  it('fetchStopIdsByRoute', async () => {
    const fetchService = jest.fn().mockResolvedValue(stopsData);
    const mbta = new MBTA(API_KEY, fetchService);
    const fetched = await mbta.fetchStopsByRoute('someRoute');

    expect(fetched).toEqual(stopsDataByRouteId);
    expect(fetchService).toBeCalledWith(
      `https://api-v3.mbta.com/stops?route=someRoute&api_key=${API_KEY}`
    );
  });

  it('fetchStopByName', async () => {
    const fetchService = jest.fn().mockResolvedValue(stopsData);
    const mbta = new MBTA(API_KEY, fetchService);
    const fetched = await mbta.fetchStopsByName('Revere');

    expect(fetched.length).toBe(2);
    expect(fetched).toEqual(
      stopsData.data.filter(stop => stop.attributes.name.match('Revere'))
    );
    jest.clearAllMocks();
    const fetchedExact = await mbta.fetchStopsByName('Revere', { exact: true });

    expect(fetchedExact.length).toBe(1);
    expect(fetchedExact).toEqual(
      stopsData.data.filter(stop => stop.attributes.name === 'Revere')
    );

    expect(fetchService).toBeCalledWith(
      `https://api-v3.mbta.com/stops?api_key=${API_KEY}`
    );
  });
});
