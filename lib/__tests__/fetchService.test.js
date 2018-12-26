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

  it('throws if error object in response', () => {
    expect.assertions(1);
    const error = { response: { data: { errors: [{ message: 'hi' }] } } };
    service.get = () => Promise.reject(error);
    return fetchService('testUrl', service).catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"hi"`);
    });
  });

  it('returns normal data', () => {
    expect.assertions(1);
    service.get = () => Promise.resolve({ data: 'hi' });
    return fetchService('testUrl', service).then(res => {
      expect(res).toBe('hi');
    });
  });
});
