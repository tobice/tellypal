var tvdb = require('./../libs/tvdb');
var Promise = require('bluebird');
var unpromisifyFetcher = require('../utils/unpromisifyFetcher');

var tvshowsFetcher = {
    name: 'tvshows',

    read: function (req, resource, params) {
        if (params && params.search) {
            return tvdb.searchSeries(params.search);
        }
        else if (params && params.seriesid && params.season) {
            return tvdb.getSeason(params.seriesid, params.season);
        }
        else if (params && params.seriesid) {
            return tvdb.getSeries(params.seriesid)
                .then(function (series) {
                    // Remove list of episodes to lower the traffic
                    series.seasons = null;
                    return series;
                });
        }
        else {
            return Promise.reject(new Error('No params!'));
        }
    }
};

module.exports = unpromisifyFetcher(tvshowsFetcher);