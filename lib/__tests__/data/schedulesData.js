module.exports = {
  data: [
    {
      attributes: {
        arrival_time: '2018-12-19T23:38:00-05:00',
        departure_time: '2018-12-19T23:38:00-05:00',
        drop_off_type: 1,
        pickup_type: 0,
        stop_sequence: 1,
        timepoint: true,
      },
      id: 'schedule-38230146-110-1',
      relationships: {
        prediction: {},
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '110', type: 'stop' } },
        trip: { data: { id: '38230146', type: 'trip' } },
      },
      type: 'schedule',
    },
    {
      attributes: {
        arrival_time: '2018-12-19T23:39:00-05:00',
        departure_time: '2018-12-19T23:39:00-05:00',
        drop_off_type: 0,
        pickup_type: 0,
        stop_sequence: 2,
        timepoint: false,
      },
      id: 'schedule-38230146-2168-2',
      relationships: {
        prediction: {},
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '2168', type: 'stop' } },
        trip: { data: { id: '38230146', type: 'trip' } },
      },
      type: 'schedule',
    },
    {
      attributes: {
        arrival_time: '2018-12-19T23:39:00-05:00',
        departure_time: '2018-12-19T23:39:00-05:00',
        drop_off_type: 0,
        pickup_type: 0,
        stop_sequence: 3,
        timepoint: false,
      },
      id: 'schedule-38230146-2166-3',
      relationships: {
        prediction: {},
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '2166', type: 'stop' } },
        trip: { data: { id: '38230146', type: 'trip' } },
      },
      type: 'schedule',
    },
  ],
  jsonapi: { version: '1.0' },
  links: {
    first: 'https://api-v3.mbta.com/schedules?page[limit]=3&page[offset]=0&route=1',
    last: 'https://api-v3.mbta.com/schedules?page[limit]=3&page[offset]=5901&route=1',
    next: 'https://api-v3.mbta.com/schedules?page[limit]=3&page[offset]=3&route=1',
  },
};
