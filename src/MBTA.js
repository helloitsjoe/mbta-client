const axios = require('axios');
const { convertMs } = require('./utils');

class MBTA {

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.queryParams = null;
        this.prediction = null;

        // mbta.predict({
        //     stopID: 'someID',
        //     directionID: '1',
        //     sort: 'sortOption'
        // });
    }

    predict(queryParams) {
        const finalQuery = queryParams || this.queryParams;

        return axios.get(this._getUrl(finalQuery))
            .then(res => {
                if (!(res && res.data)) {
                    throw new Error('No data from MBTA');
                }
                return this.prediction = res.data;
            })
            .catch(err => {
                console.error('Error fetching MBTA data:', err);
                throw error;
            });
    }

    arrivals({ prediction, maxArrivals, timeUnits, /* tooCloseMins, tooFarMins, */ }) {
        const finalPrediction = prediction || this.prediction;
        return this._selectArrivalISOs(finalPrediction)
            .map(arrivalISO => {
                if (arrivalISO == null) return 0;
                const msUntilArrival = new Date(arrivalISO).valueOf() - Date.now();
                return msUntilArrival >= 0 ? msUntilArrival : 0;
            })
            // .filter(msUntilArrival => {
            //     return msUntilArrival > tooClose
            //         && msUntilArrival < tooFar;
            // })
            .slice(0, maxArrivals)
            .map(arrivalMs => {
                return Math.floor(convertMs(arrivalMs, timeUnits));
            });
    }

    _selectArrivalISOs(prediction) {
        if (prediction && prediction.data) {
            return prediction.data.map(vehicle => vehicle.attributes.arrival_time);
        }
    }

    _getUrl(queryParams) {
        const baseUrl = `https://api-v3.mbta.com/predictions`;

        if (!(queryParams && Object.keys(queryParams).length)) {
            return baseUrl;
        }

        const keyAdapter = {
            stopID: 'stop',
            directionID: 'direction_id',
        }

        const queryString = Object
            .entries(queryParams)
            .map(([key, value]) => {
                if (value == null) {
                    return;
                }
                if (key === 'stopID' || key === 'directionID') {
                    return `filter[${keyAdapter[key]}]=${value}`;
                }
                if (key === 'sort') {
                    return `sort=${value}`;
                }
            })
            .filter(Boolean)
            .join('&');

        return `${baseUrl}?${queryString}`;
    }

    // filter() {
    //     // TODO
    // }

    // predictByStop(stopID) {
    //     return this.predict({ stopID });
    // }

    // byDirection(directionID) {
    //     return this._addParam({ directionID });
    // }

    // byStop(stopID) {
    //     return this._addParam({ stopID });
    // }

    // sort(option) {
    //     // TODO: enum of options
    //     return this._addParam({ sort: option });
    // }

    // _addParam(paramObj) {
    //     this.queryParams = { ...this.queryParams, ...paramObj };
    //     return this;
    // }
}

module.exports = MBTA;