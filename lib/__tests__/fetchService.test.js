const axios = require('axios');
const fetchService = require('../fetchService');

jest.spyOn(axios, 'get');

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchService', () => {
  const service = {};
  const logger = {
    error: () => {},
    warn: () => {},
  };

  it('throws if no response object', () => {
    expect.assertions(1);
    service.get = () => Promise.resolve();
    return fetchService('testUrl', service, logger).catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"No data from MBTA"`);
    });
  });

  it('throws if no data in response', () => {
    expect.assertions(1);
    service.get = () => Promise.resolve({ data: null });
    return fetchService('testUrl', service, logger).catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"No data from MBTA"`);
    });
  });

  it('throws error from MBTA response if it exists', () => {
    expect.assertions(1);
    // This is the format axios sends error objects back from bad requests
    const error = { response: { data: { errors: [{ message: 'hi' }] } } };
    service.get = () => Promise.reject(error);
    return fetchService('testUrl', service, logger).catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"hi"`);
    });
  });

  it('service defaults to axios if no mock passed in', () => {
    axios.get.mockRejectedValue(new Error('Oh no!'));
    expect.assertions(2);
    return fetchService('testUrl', undefined, logger).catch(err => {
      expect(axios.get).toBeCalledWith('testUrl');
      expect(err.message).toMatchInlineSnapshot(`"Oh no!"`);
    });
  });

  it('logger defaults to console if not passed in', () => {
    const originalError = console.error;
    console.error = jest.fn();
    axios.get.mockRejectedValue(new Error('Oh no!'));
    expect.assertions(1);
    return fetchService('testUrl', undefined).catch(() => {
      expect(console.error).toBeCalledWith(
        'Error fetching MBTA data:',
        'Oh no!'
      );
      console.error = originalError;
    });
  });

  it('returns valid response object', () => {
    service.get = () => Promise.resolve({ data: 'hi' });
    return fetchService('testUrl', service, logger).then(res => {
      expect(res).toBe('hi');
    });
  });
});
