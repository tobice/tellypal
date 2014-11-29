var request = require('superagent');
var _ = require('lodash');
var url = require('url');
var moment = require('moment');

var xmlHelpers = require('../utils/xmlHelpers');
var seriesHelpers = require('../utils/seriesHelpers.jsx');

var TVDB_API_KEY = '0A1C6FE6954B01FC';
var TVDB_API_URL = 'http://thetvdb.com/api/';
var TVDB_BANNER_URL = 'http://thetvdb.com/banners/';

var tvdb = {

    /**
     * Performs dynamic TVDB search.
     * @param {string} seriesname - The name of the series to search for
     * @returns {Promise.<Array.<Object>>} - List of found series (simplified result).
     */
    searchSeries: function (seriesname) {
        var url = this.makeUrl('../GetSeries.php', {seriesname: seriesname});
        return request(url).promise()
            .then(xmlHelpers.parseXMLResponse)
            .then(function (json) {
                return json.Data.Series;
            })
            .then(xmlHelpers.cleanObjects);
    },

    /**
     * Get full series information from TVDB database by its id, including all
     * episodes, separated into season. Returned object contains some extra
     * properties: hasSpecials, seasonCount and episodeCount.
     * @param seriesid - The series id
     * @returns {Promise.<Object>}
     */
    getSeries: function (seriesid) {
        var url = this.makeUrl('series/' + seriesid + '/all/en.xml', {});
        return request(url).promise()
            .catch(function() {
                throw new Error('Unable to download series info. Maybe series does not exists?')
            })
            .then(xmlHelpers.parseXMLResponse)
            .then(function (json) {
                var series = xmlHelpers.cleanObject(json.Data.Series[0]);
                var episodes = xmlHelpers.cleanObjects(json.Data.Episode);

                // Add time information to episode air date
                _.each(episodes, function (episode) {
                    episode.FirstAired = episode.FirstAired + ' '
                        + moment(series.Airs_Time, 'h:mm A').format('HH:mm');
                });

                series.seasons = seriesHelpers.episodesToSeason(episodes);
                series.hasSpecials = series.seasons.hasOwnProperty('0');
                series.seasonCount = _.size(series.seasons) - (series.hasSpecials ? 1 : 0);
                series.episodeCount = episodes.length;
                return series;
            })
    },

    /**
     * Get series season.
     * @param {string} seriesid - The series id
     * @param {int} season - Season number (zero for specials)
     * @returns {Promise.<Object>} - Indexed list of episodes in the season
     */
    getSeason: function (seriesid, season) {
        return this.getSeries(seriesid)
            .then(function (series) {
                if (!series.seasons[season]) {
                    throw new Error('Season does not exist');
                }
                return series.seasons[season];
            });
    },

    /**
     * Get list of banners for given series
     * @param seriesid - The series id
     * @returns {Promise.<Array.<Object>>}
     */
    getBanners: function (seriesid) {
        var url = this.makeUrl('series/' + seriesid + '/banners.xml', {});
        return request(url).promise()
            .catch(function () {
                throw new Error('Unable to download banner info. Maybe series does not exists?')
            })
            .then(xmlHelpers.parseXMLResponse)
            .then(function (json) {
                return json.Banners.Banner;
            })
            .then(xmlHelpers.cleanObjects)
    },

    /**
     * Returns URL for the best banner of given type. The banner returned is
     * determined by rating count and average rating.
     * @param seriesid - The series id
     * @param type - Banner type (poster|fanart|series|season)
     * @return {Promise.<string>}
     */
    getBannerUrl: function (seriesid, type) {
        return this.getBanners(seriesid)
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

    /**
     * Makes API URL.
     * @param {string} action
     * @param {Object} params - Get params
     * @returns {string}
     */
    makeUrl: function (action, params) {
        var tvdb = url.parse(TVDB_API_URL);
        tvdb.pathname += TVDB_API_KEY + '/' + action;
        tvdb.query = params;
        return url.format(tvdb);
    }
};

module.exports = tvdb;