module.exports = {
  data: [
    {
      attributes: {
        latitude: null,
        longitude: null,
        name: 'South Station customer service agent with blank CharlieCards',
        properties: [
          { name: 'dispenses', value: 'fare-media' },
          { name: 'note', value: 'Weekday hours: 7:00A - 7:00P' },
          { name: 'note', value: 'Saturday hours: 7:00A - 7:00P' },
          { name: 'note', value: 'Sunday hours: 7:00A - 7:00P' },
        ],
        type: 'FARE_MEDIA_ASSISTANT',
      },
      id: 'charliecard-sstat',
      links: { self: '/facilities/charliecard-sstat' },
      relationships: { stop: { data: { id: 'place-sstat', type: 'stop' } } },
      type: 'facility',
    },
    {
      attributes: {
        latitude: 42.28123,
        longitude: -71.237271,
        name: 'Needham Center Parking Lot',
        properties: [
          { name: 'capacity', value: 35 },
          { name: 'enclosed', value: 2 },
          { name: 'attended', value: 2 },
          { name: 'operator', value: 'Town of Needham' },
          { name: 'owner', value: 'City/Town' },
          { name: 'fee-daily', value: 'Town permit required' },
          { name: 'municipality', value: 'Needham' },
          {
            name: 'note',
            value:
              'Town of Needham is responsible for parking maintenance, payments, and snow removal.',
          },
          { name: 'contact', value: 'Town of Needham, Parking Clerk' },
          { name: 'contact-url', value: 'http://www.needhamma.gov' },
          { name: 'contact-phone', value: '781-455-7500' },
        ],
        type: 'PARKING_AREA',
      },
      id: 'park-NB-0127',
      links: { self: '/facilities/park-NB-0127' },
      relationships: { stop: { data: { id: 'Needham Center', type: 'stop' } } },
      type: 'facility',
    },
    {
      attributes: {
        latitude: null,
        longitude: null,
        name: 'Lechmere mobile lift (Exit Only)',
        properties: [
          {
            name: 'note',
            value:
              'Significant barriers exist at station, but customers may be able to board/exit train using mobile lift',
          },
          { name: 'excludes-stop', value: 70211 },
          { name: 'excludes-stop', value: 9070211 },
          { name: 'excludes-stop', value: 9070212 },
          { name: 'excludes-stop', value: 70144 },
          { name: 'excludes-stop', value: 70170 },
          { name: 'excludes-stop', value: 14150 },
        ],
        type: 'PORTABLE_BOARDING_LIFT',
      },
      id: 'portlift-lech-0',
      links: { self: '/facilities/portlift-lech-0' },
      relationships: { stop: { data: { id: 'place-lech', type: 'stop' } } },
      type: 'facility',
    },
  ],
  jsonapi: { version: '1.0' },
  links: {
    first: 'https://api-v3.mbta.com/facilities?page[limit]=3&page[offset]=0',
    last: 'https://api-v3.mbta.com/facilities?page[limit]=3&page[offset]=1626',
    next: 'https://api-v3.mbta.com/facilities?page[limit]=3&page[offset]=3',
  },
};
