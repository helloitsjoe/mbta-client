module.exports = {
  data: [
    {
      attributes: {
        active_period: [{ end: '2019-01-11T02:30:00-05:00', start: '2019-01-10T04:30:00-05:00' }],
        banner: null,
        cause: 'MAINTENANCE',
        created_at: '2018-12-19T19:45:21-05:00',
        description:
          'Please use the call box or see station personnel for assistance traveling around the station for the alternate entrance/exit.',
        effect: 'ELEVATOR_CLOSURE',
        header:
          'Ruggles Elevator 851 (Forsyth Street to upper lobby) unavailable on Thu Jan 10 due to maintenance',
        informed_entity: [
          { activities: ['USING_WHEELCHAIR'], facility: '851', stop: '17861' },
          { activities: ['USING_WHEELCHAIR'], facility: '851', stop: 'place-rugg' },
          { activities: ['USING_WHEELCHAIR'], facility: '851', stop: '17862' },
          { activities: ['USING_WHEELCHAIR'], facility: '851', stop: '17863' },
          { activities: ['USING_WHEELCHAIR'], facility: '851', stop: '70010' },
          { activities: ['USING_WHEELCHAIR'], facility: '851', stop: '70011' },
          { activities: ['USING_WHEELCHAIR'], facility: '851', stop: 'door-rugg-forsyth' },
          { activities: ['USING_WHEELCHAIR'], facility: '851', stop: 'Ruggles' },
        ],
        lifecycle: 'UPCOMING',
        service_effect: 'Ruggles elevator unavailable',
        severity: 3,
        short_header:
          'Ruggles Elevator 851 (Forsyth Street to upper lobby) unavailable on Thu Jan 10 due to maintenance',
        timeframe: 'January 10',
        updated_at: '2018-12-19T19:45:21-05:00',
        url: null,
      },
      id: '287566',
      links: { self: '/alerts/287566' },
      type: 'alert',
    },
    {
      attributes: {
        active_period: [
          { end: '2019-01-06T02:30:00-05:00', start: '2019-01-05T04:30:00-05:00' },
          { end: '2019-01-07T02:30:00-05:00', start: '2019-01-06T04:30:00-05:00' },
          { end: '2019-01-13T02:30:00-05:00', start: '2019-01-12T04:30:00-05:00' },
        ],
        banner: null,
        cause: 'UNKNOWN_CAUSE',
        created_at: '2018-12-28T13:10:34-05:00',
        description: 'Affected Routes:\r\nThe Wollaston Shuttle',
        effect: 'SERVICE_CHANGE',
        header:
          'Due to a water main break, the Newport Ave @ Wollaston Station (inbound) shuttle bus stop is temporarily closed. Please board inbound buses at Beale St @ Wollaston Branch Library for service to North Quincy.',
        informed_entity: [
          { activities: ['BOARD', 'EXIT', 'RIDE'], route: 'Red', route_type: 1, stop: '70101' },
          {
            activities: ['BOARD', 'EXIT', 'RIDE'],
            route: 'Red',
            route_type: 1,
            stop: 'place-qnctr',
          },
          { activities: ['BOARD', 'EXIT', 'RIDE'], route: 'Red', route_type: 1, stop: '70102' },
        ],
        lifecycle: 'NEW',
        service_effect: 'Red Line notice',
        severity: 5,
        short_header:
          ' the Newport Ave @ Wollaston Sta shuttle bus stop is temporarily closed. Please board inb. buses at Beale St @ Wollaston Branch Library for ',
        timeframe: null,
        updated_at: '2018-12-28T13:10:34-05:00',
        url: 'https://www.mbta.com/wollaston',
      },
      id: '288553',
      links: { self: '/alerts/288553' },
      type: 'alert',
    },
    {
      attributes: {
        active_period: [{ end: null, start: '2018-09-25T22:22:30-04:00' }],
        banner: null,
        cause: 'UNKNOWN_CAUSE',
        created_at: '2018-09-25T22:22:31-04:00',
        description:
          'Access to the Kendall/MIT Station will remain open and accessible on the Main Street side of the station throughout this construction.\r\n \r\nThe pedestrian plaza between Carleton Street and Main Street in Kendall Square will be closed due to the construction of an underground garage. \r\n \r\nCustomers are encouraged to utilize alternative paths to/from the station using the paths on Ames Street, Dock Street, or Wadsworth Street.\r\n\r\nAffected routes:\r\nRed Line',
        effect: 'STATION_ISSUE',
        header:
          'The pedestrian walkway near Kendall/MIT Station (inbound) is closed until further notice due to MIT construction.',
        informed_entity: [
          { activities: ['BOARD'], route: 'Red', route_type: 1, stop: '70071' },
          { activities: ['BOARD'], route: 'Red', route_type: 1, stop: 'place-knncl' },
          { activities: ['BOARD'], route: 'Red', route_type: 1, stop: '70072' },
        ],
        lifecycle: 'ONGOING',
        service_effect: 'Change at Kendall/MIT',
        severity: 1,
        short_header:
          'The pedestrian walkway near Kendall/MIT Station (inbound) is closed until further notice due to MIT construction.',
        timeframe: 'ongoing',
        updated_at: '2018-09-25T22:22:31-04:00',
        url: 'https://courbanize.com/projects/mit-kendall-square/information',
      },
      id: '270465',
      links: { self: '/alerts/270465' },
      type: 'alert',
    },
  ],
};
