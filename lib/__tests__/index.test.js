/* eslint-disable global-require */
describe('MBTA', () => {
  // // Uncomment to suppress console
  // console.warn = jest.fn();
  // console.error = jest.fn();

  require('./mbta.test');
  require('./fetch.test');
  require('./helpers.test');
  require('./selectors.test');
  require('./fetchService.test');
});
