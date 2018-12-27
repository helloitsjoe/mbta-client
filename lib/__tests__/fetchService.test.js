const fetchService = require('../fetchService');

describe('fetchService', () => {
  const service = {};

  it('throws if no response object', () => {
    expect.assertions(1);
    service.get = () => Promise.resolve();
    return fetchService('testUrl', service).catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"No data from MBTA"`);
    });
  });

  it('throws if no data in response', () => {
    expect.assertions(1);
    service.get = () => Promise.resolve({ data: null });
    return fetchService('testUrl', service).catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"No data from MBTA"`);
    });
  });

  it('throws error from MBTA response if it exists', () => {
    expect.assertions(1);
    // This is the format axios sends error objects back from bad requests
    const error = { response: { data: { errors: [{ message: 'hi' }] } } };
    service.get = () => Promise.reject(error);
    return fetchService('testUrl', service).catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"hi"`);
    });
  });

  it('defaults to axios if no mock passed in', () => {
    expect.assertions(2);
    return fetchService('testUrl').catch(err => {
      expect(typeof err.request).toBe('object');
      expect(err.message).toMatchInlineSnapshot(`"Network Error"`);
    });
  });

  it('returns valid response object', () => {
    service.get = () => Promise.resolve({ data: 'hi' });
    return fetchService('testUrl', service).then(res => {
      expect(res).toBe('hi');
    });
  });
});
