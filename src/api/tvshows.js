var request = require('superagent');
var xmlHelpers = require('../lib/xmlHelpers');
var _ = require('lodash');

var TVDB_API_KEY = '0A1C6FE6954B01FC';
var TVDB_API_URL = 'http://thetvdb.com/api/';

var tvshows = {

    getSeries: function (seriesname) {
        var url = TVDB_API_URL + 'GetSeries.php?seriesname=' + seriesname;
        return request(url).promise()
            .then(xmlHelpers.parseXMLResponse)
            .then(function (json) {
                return json.Data.Series;
            })
            .then(xmlHelpers.cleanObjects);
    },


};

module.exports = tvshows;