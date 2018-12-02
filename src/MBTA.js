// import axios from 'axios';
const axios = require('axios');

class MBTA {

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.queryParams = null;

        // mbta.fetch({
        //     stopID: 'someID',
        //     directionID: '1',
        //     sort: 'sortOption'
        // });

        // mbta.byDirection(direction_id)
        //     .byStop(stop)
        //     .sort(sortOption)
        //     .fetch();
    }

    fetch(queryParams) {
        const finalQuery = queryParams || this.queryParams;

        return axios.get(this._getUrl(finalQuery))
            .then(res => res && res.data)
            .catch(err => {
                console.error('Error fetching MBTA data:', err);
                throw error;
            });
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

    filter() {
        // TODO: Find out what the filters are
    }

    fetchByStop(stopID) {
        return this.fetch({ stopID });
    }

    byDirection(directionID) {
        return this._addParam({ directionID });
    }

    byStop(stopID) {
        return this._addParam({ stopID });
    }

    sort(option) {
        // TODO: enum of options
        return this._addParam({ sort: option });
    }

    _addParam(paramObj) {
        this.queryParams = { ...this.queryParams, ...paramObj };
        return this;
    }
}

module.exports = MBTA;