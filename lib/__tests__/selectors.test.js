const MBTA = require('../mbta');
const includeData = require('./data/includeData');

it('included selects by type', async () => {
  const fetchService = jest.fn().mockResolvedValue(includeData);
  const mbta = new MBTA(null, fetchService);

  const fetched = await mbta.fetchStops();

  expect(mbta.selectIncluded).toThrowErrorMatchingInlineSnapshot(
    `"included() requires an MBTA response as an argument"`
  );

  expect(mbta.selectIncluded(fetched)).toEqual(includeData.included);
  expect(mbta.selectIncluded(fetched, 'trip')).toEqual(
    includeData.included.filter(({ type }) => type === 'trip')
  );
  expect(mbta.selectIncluded(fetched, ['trip'])).toEqual(
    includeData.included.filter(({ type }) => type === 'trip')
  );
  expect(mbta.selectIncluded(fetched, ['trip', 'route'])).toEqual(
    includeData.included.filter(({ type }) => type === 'trip' || type === 'route')
  );
});
