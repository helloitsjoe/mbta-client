module.exports = {
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
        color: 'ED8B00',
        description: 'Rapid Transit',
        direction_names: ['Southbound', 'Northbound'],
        long_name: 'Orange Line',
        short_name: '',
        sort_order: 3,
        text_color: 'FFFFFF',
        type: 1,
      },
      id: 'Orange',
      links: { self: '/routes/Orange' },
      type: 'route',
    },
    {
      attributes: {
        color: '003DA5',
        description: 'Rapid Transit',
        direction_names: ['Westbound', 'Eastbound'],
        long_name: 'Blue Line',
        short_name: '',
        sort_order: 8,
        text_color: 'FFFFFF',
        type: 1,
      },
      id: 'Blue',
      links: { self: '/routes/Blue' },
      type: 'route',
    },
  ],
  jsonapi: { version: '1.0' },
};
