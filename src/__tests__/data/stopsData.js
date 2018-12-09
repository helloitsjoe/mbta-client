module.exports = {
  data: [
    {
      attributes: {
        address: null,
        description: null,
        latitude: 42.29108,
        location_type: 0,
        longitude: -71.185716,
        name: 'Sawmill Brook Pkwy @ Keller Path',
        platform_code: null,
        platform_name: null,
        wheelchair_boarding: 1,
      },
      id: '8553',
      links: { self: '/stops/8553' },
      relationships: {
        child_stops: {},
        facilities: {
          links: { related: '/facilities/?filter[stop]=8553' },
        },
        parent_station: { data: null },
      },
      type: 'stop',
    },
    {
      attributes: {
        address: null,
        description: null,
        latitude: 42.400923,
        location_type: 0,
        longitude: -70.997655,
        name: 'Revere Beach Pkwy opp N Shore Rd',
        platform_code: null,
        platform_name: null,
        wheelchair_boarding: 0,
      },
      id: '5808',
      links: { self: '/stops/5808' },
      relationships: {
        child_stops: {},
        facilities: {
          links: { related: '/facilities/?filter[stop]=5808' },
        },
        parent_station: { data: null },
      },
      type: 'stop',
    },
    {
      attributes: {
        address: null,
        description: null,
        latitude: 42.549752,
        location_type: 0,
        longitude: -70.931153,
        name: 'Endicott St @ Market Basket',
        platform_code: null,
        platform_name: null,
        wheelchair_boarding: 1,
      },
      id: '4614',
      links: { self: '/stops/4614' },
      relationships: {
        child_stops: {},
        facilities: {
          links: { related: '/facilities/?filter[stop]=4614' },
        },
        parent_station: { data: null },
      },
      type: 'stop',
    },
  ],
  jsonapi: { version: '1.0' },
  links: {
    first: 'https://api-v3.mbta.com/stops?page[limit]=3&page[offset]=0',
    last: 'https://api-v3.mbta.com/stops?page[limit]=3&page[offset]=8559',
    next: 'https://api-v3.mbta.com/stops?page[limit]=3&page[offset]=3',
  },
};
