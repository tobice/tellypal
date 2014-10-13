var tvshows = require('./tvshows');
var Promise = require('bluebird');
var unpromisifyFetcher = require('../lib/unpromisifyFetcher');

var tvshowsFetcher = {
    name: 'tvshows',

    read: function (req, resource, params) {
        if (params && params.search) {
            return tvshows.searchSeries(params.search);
        }
        else {
            return Promise.reject(new Error('No params!'));
        }
    }
};


module.exports = unpromisifyFetcher(tvshowsFetcher);