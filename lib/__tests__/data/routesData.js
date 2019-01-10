exports.routesData = {
  data: [
    {
      attributes: {
        color: 'DA291C',
        description: 'Rapid Transit',
        direction_names: ['Southbound', 'Northbound'],
        long_name: 'Red Line',
        short_name: '',
        sort_order: 1,
        text_color: 'FFFFFF',
        type: 1,
      },
      id: 'Red',
      links: { self: '/routes/Red' },
      type: 'route',
    },
    {
      attributes: {
        color: '7C878E',
        description: 'Key Bus',
        direction_destinations: ['Logan Airport', 'South Station'],
        direction_names: ['Outbound', 'Inbound'],
        long_name: 'Logan Airport - South Station',
        short_name: 'SL1',
        sort_order: 9,
        text_color: 'FFFFFF',
        type: 3
      },
      id: '741',
      links: { self: '/routes/741' },
      type: 'route'
    },
    {
      attributes: {
        color: 'FFC72C',
        description: 'Local Bus',
        direction_destinations: ['Fields Corner', 'Kenmore or Ruggles'],
        direction_names: ['Outbound', 'Inbound'],
        long_name: 'Fields Corner - Kenmore or Ruggles',
        short_name: '19',
        sort_order: 1900,
        text_color: '000000',
        type: 3,
      },
      id: '19',
      links: { self: '/routes/19' },
      type: 'route',
    },
  ],
  jsonapi: { version: '1.0' },
};

exports.routesDataBasic = [
  {
    id: 'Red',
    long_name: 'Red Line',
    direction_names: ['Southbound', 'Northbound'],
  },
  {
    id: '741',
    long_name: 'Logan Airport - South Station',
    short_name: 'SL1',
    direction_names: ['Outbound', 'Inbound'],
  },
  {
    id: '19',
    long_name: 'Fields Corner - Kenmore or Ruggles',
    direction_names: ['Outbound', 'Inbound'],
  }
];
