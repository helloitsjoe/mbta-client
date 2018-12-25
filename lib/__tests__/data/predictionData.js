const predictionData = {
  data: [
    {
      attributes: {
        arrival_time: null,
        departure_time: '2018-12-05T20:21:55-05:00',
        direction_id: 0,
        schedule_relationship: null,
        status: null,
        stop_sequence: 13,
      },
      id: 'prediction-38230291-91-13',
      relationships: {
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '91', type: 'stop' } },
        trip: { data: { id: '38230291', type: 'trip' } },
      },
      type: 'prediction',
    },
    {
      attributes: {
        arrival_time: '2018-12-05T20:27:15-05:00',
        departure_time: null,
        direction_id: 0,
        schedule_relationship: null,
        status: null,
        stop_sequence: 13,
      },
      id: 'prediction-38230158-91-13',
      relationships: {
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '91', type: 'stop' } },
        trip: { data: { id: '38230158', type: 'trip' } },
      },
      type: 'prediction',
    },
    {
      attributes: {
        arrival_time: '2018-12-05T20:28:42-05:00',
        departure_time: '2018-12-05T20:28:43-05:00',
        direction_id: 0,
        schedule_relationship: null,
        status: null,
        stop_sequence: 13,
      },
      id: 'prediction-38230585-91-13',
      relationships: {
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '91', type: 'stop' } },
        trip: { data: { id: '38230585', type: 'trip' } },
      },
      type: 'prediction',
    },
    {
      attributes: {
        arrival_time: '2018-12-05T20:36:53-05:00',
        departure_time: '2018-12-05T20:36:54-05:00',
        direction_id: 0,
        schedule_relationship: null,
        status: null,
        stop_sequence: 13,
      },
      id: 'prediction-38230579-91-13',
      relationships: {
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '91', type: 'stop' } },
        trip: { data: { id: '38230579', type: 'trip' } },
      },
      type: 'prediction',
    },
    {
      attributes: {
        arrival_time: '2018-12-05T20:47:49-05:00',
        departure_time: '2018-12-05T20:47:50-05:00',
        direction_id: 0,
        schedule_relationship: null,
        status: null,
        stop_sequence: 13,
      },
      id: 'prediction-38230584-91-13',
      relationships: {
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '91', type: 'stop' } },
        trip: { data: { id: '38230584', type: 'trip' } },
      },
      type: 'prediction',
    },
    {
      attributes: {
        arrival_time: '2018-12-05T20:58:49-05:00',
        departure_time: '2018-12-05T20:58:50-05:00',
        direction_id: 0,
        schedule_relationship: null,
        status: null,
        stop_sequence: 13,
      },
      id: 'prediction-38230578-91-13',
      relationships: {
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '91', type: 'stop' } },
        trip: { data: { id: '38230578', type: 'trip' } },
      },
      type: 'prediction',
    },
    {
      attributes: {
        arrival_time: '2018-12-05T21:10:49-05:00',
        departure_time: '2018-12-05T21:10:50-05:00',
        direction_id: 0,
        schedule_relationship: null,
        status: null,
        stop_sequence: 13,
      },
      id: 'prediction-38230572-91-13',
      relationships: {
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '91', type: 'stop' } },
        trip: { data: { id: '38230572', type: 'trip' } },
      },
      type: 'prediction',
    },
    {
      attributes: {
        arrival_time: '2018-12-05T21:22:49-05:00',
        departure_time: '2018-12-05T21:22:50-05:00',
        direction_id: 0,
        schedule_relationship: null,
        status: null,
        stop_sequence: 13,
      },
      id: 'prediction-38230583-91-13',
      relationships: {
        route: { data: { id: '1', type: 'route' } },
        stop: { data: { id: '91', type: 'stop' } },
        trip: { data: { id: '38230583', type: 'trip' } },
      },
      type: 'prediction',
    },
  ],
  jsonapi: { version: '1.0' },
};

const limitedPredictionData = {
  data: [
    {
      attributes: {
        arrival_time: '2018-12-10T20:02:58-05:00',
        departure_time: '2018-12-10T20:04:10-05:00',
        direction_id: 1,
        schedule_relationship: null,
        status: null,
        stop_sequence: 130,
      },
      id: 'prediction-38066487-21:00-KL-70080-130',
      relationships: {
        route: { data: { id: 'Red', type: 'route' } },
        stop: { data: { id: '70080', type: 'stop' } },
        trip: { data: { id: '38066487-21:00-KL', type: 'trip' } },
      },
      type: 'prediction',
    },
  ],
  jsonapi: { version: '1.0' },
  links: {
    first: 'https://api-v3.mbta.com/predictions?filter[stop]=70080&page[limit]=1&page[offset]=0',
    last: 'https://api-v3.mbta.com/predictions?filter[stop]=70080&page[limit]=1&page[offset]=13',
    next: 'https://api-v3.mbta.com/predictions?filter[stop]=70080&page[limit]=1&page[offset]=3',
    prev: 'https://api-v3.mbta.com/predictions?filter[stop]=70080&page[limit]=1&page[offset]=1',
  },
};

module.exports = {
  predictionData,
  limitedPredictionData,
};
