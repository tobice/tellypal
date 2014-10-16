var request = require('superagent');
var xmlHelpers = require('../utils/xmlHelpers');
var _ = require('lodash');
var url = require('url');

var TVDB_API_KEY = '0A1C6FE6954B01FC';
var TVDB_API_URL = 'http://thetvdb.com/api/';
var TVDB_BANNER_URL = 'http://thetvdb.com/banners/';

var tvdb = {

    searchSeries: function (seriesname) {
        var url = this.makeUrl('../GetSeries.php', {seriesname: seriesname});
        return request(url).promise()
            .then(xmlHelpers.parseXMLResponse)
            .then(function (json) {
                return json.Data.Series;
            })
            .then(xmlHelpers.cleanObjects);
    },

    getBannerUrl: function (seriesid, type) {
        var url = this.makeUrl('series/' + seriesid + '/banners.xml');
        return request(url).promise()
            .catch(function () {
                throw new Error('Unable to download banner info. Maybe series does not exists?')
            })
            .then(xmlHelpers.parseXMLResponse)
            .then(function (json) {
                return json.Banners.Banner;
            })
            .then(xmlHelpers.cleanObjects)
            .then(function (banners) {
                // Filter banners by type, take the five most rated banners and
                // select the one with highest rating.
                banners = _.where(banners, {BannerType: type});
                banners = _.sortBy(banners, function (banner) { return parseInt(banner.RatingCount) });
                banners = _.last(banners, 5);
                banners = _.sortBy(banners, function (banner) { return parseFloat(banner.Rating)});

                if (banners.length == 0) {
                    throw new Error('No banner of this type for this series.');
                }

                var banner = _.last(banners);
                return TVDB_BANNER_URL + banner.BannerPath;
            });
    },

    makeUrl: function (action, params) {
        var tvdb = url.parse(TVDB_API_URL);
        tvdb.pathname += TVDB_API_KEY + '/' + action;
        tvdb.query = params;
        return url.format(tvdb);
    }
};

module.exports = tvdb;