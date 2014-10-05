var request = require('superagent');
var xmlHelpers = require('../lib/xmlHelpers');
var _ = require('lodash');
var url = require('url');

var TVDB_API_KEY = '0A1C6FE6954B01FC';
var TVDB_API_URL = 'http://thetvdb.com/api/';

var tvshows = {

    getSeries: function (seriesname) {
        var url = this.makeUrl('GetSeries', {seriesname: seriesname});
        return request(url).promise()
            .then(xmlHelpers.parseXMLResponse)
            .then(function (json) {
                return json.Data.Series;
            })
            .then(xmlHelpers.cleanObjects);
    },

    makeUrl: function (action, params) {
        var tvdb = url.parse(TVDB_API_URL);
        tvdb.pathname += action + '.php';
        tvdb.query = params;
        return url.format(tvdb);
    }
};

module.exports = tvshows;