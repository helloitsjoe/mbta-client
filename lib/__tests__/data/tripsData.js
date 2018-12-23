module.exports = {
  data: [
    {
      attributes: {
        bikes_allowed: 1,
        block_id: 'T71-33',
        direction_id: 1,
        headsign: 'Harvard',
        name: '',
        wheelchair_accessible: 1,
      },
      id: '38267780',
      links: { self: '/trips/38267780' },
      relationships: {
        route: { data: { id: '71', type: 'route' } },
        service: {
          data: {
            id: 'BUS42018-hbt48017-Sunday-02',
            type: 'service',
          },
        },
        shape: { data: { id: '710045', type: 'shape' } },
      },
      type: 'trip',
    },
    {
      attributes: {
        bikes_allowed: 1,
        block_id: 'T71-39',
        direction_id: 0,
        headsign: 'Watertown Square',
        name: '',
        wheelchair_accessible: 1,
      },
      id: '38267790',
      links: { self: '/trips/38267790' },
      relationships: {
        route: { data: { id: '71', type: 'route' } },
        service: {
          data: {
            id: 'BUS42018-hbt48017-Sunday-02',
            type: 'service',
          },
        },
        shape: { data: { id: '710036', type: 'shape' } },
      },
      type: 'trip',
    },
    {
      attributes: {
        bikes_allowed: 1,
        block_id: 'T71-39',
        direction_id: 1,
        headsign: 'Harvard',
        name: '',
        wheelchair_accessible: 1,
      },
      id: '38267791',
      links: { self: '/trips/38267791' },
      relationships: {
        route: { data: { id: '71', type: 'route' } },
        service: {
          data: {
            id: 'BUS42018-hbt48017-Sunday-02',
            type: 'service',
          },
        },
        shape: { data: { id: '710045', type: 'shape' } },
      },
      type: 'trip',
    },
  ],
  jsonapi: { version: '1.0' },
  links: {
    first: 'https://api-v3.mbta.com/trips?page[limit]=3&page[offset]=0&route=71',
    last: 'https://api-v3.mbta.com/trips?page[limit]=3&page[offset]=1485&route=71',
    next: 'https://api-v3.mbta.com/trips?page[limit]=3&page[offset]=3&route=71',
  },
};
