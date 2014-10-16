var tvdb = require('./../libs/tvdb');
var Promise = require('bluebird');
var unpromisifyFetcher = require('../utils/unpromisifyFetcher');

var tvshowsFetcher = {
    name: 'tvshows',

    read: function (req, resource, params) {
        if (params && params.search) {
            return tvdb.searchSeries(params.search);
        }
        else {
            return Promise.reject(new Error('No params!'));
        }
    }
};


module.exports = unpromisifyFetcher(tvshowsFetcher);