const MBTA = require('../MBTA');
const fakePredictions = require('./data/predictions');

describe('mbta', () => {

    it.skip('fetchPredictions', async () => {
        // TODO: Nock
    });

    describe('arrivals', () => {

        it('returns empty array if no predictions', () => {
            const mbta = new MBTA();
            expect(mbta.arrivals({})).toEqual([]);
        });

        it('predictions returns full array of arrivals', () => {
            const mbta = new MBTA();
            const now = new Date('2018-12-05T20:21:55-05:00').valueOf();
            const arrivals = mbta.arrivals({ predictions: fakePredictions, now });
            expect(arrivals.length).toBe(fakePredictions.data.length);
            expect(arrivals).toEqual([null, 5, 6, 14, 25, 36, 48, 60]);
        });
    });
    
    describe('departures', () => {
        
        it('returns empty array if no predictions', () => {
            const mbta = new MBTA();
            expect(mbta.departures({})).toEqual([]);
        });

        it('predictions returns full array of arrivals', () => {
            const mbta = new MBTA();
            const now = new Date('2018-12-05T20:21:55-05:00').valueOf();
            const departures = mbta.departures({ predictions: fakePredictions, now });
            expect(departures.length).toBe(fakePredictions.data.length);
            expect(departures).toEqual([0, null, 6, 14, 25, 36, 48, 60]);
        });
    });
});