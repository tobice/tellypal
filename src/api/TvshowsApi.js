var Promise = require('bluebird');
var _ = require('lodash');
var tvdb = require('../libs/tvdb');
var myLibrary = require('../libs/myLibrary');
var seriesHelpers = require('../utils/seriesHelpers.jsx');

function TvshowsApi (req, config) {
    this.req = req;
    this.config = config;
}

TvshowsApi.prototype.searchSeries = function (search) {
    return tvdb.searchSeries(search);
};

TvshowsApi.prototype.getSeason = function (seriesid, season) {
    return myLibrary.getSeason(seriesid, season)
        .then(function (episodes) {
            return _.size(episodes) > 0 ? episodes : tvdb.getSeason(seriesid, season);
        });
};

TvshowsApi.prototype.getSeries = function (seriesid) {
    return myLibrary.getSeries(seriesid)
        .then(function (series) {
            return series || tvdb.getSeries(seriesid);
        })
        .then(function (series) {
            // Remove list of episodes to lower the traffic
            delete series.seasons;
            return series;
        });
};

TvshowsApi.prototype.addSeriesToLibrary = function (seriesid) {
    return tvdb.getSeries(seriesid)
        .then(function (series) {
            var episodes = seriesHelpers.seasonsToEpisodes(series.seasons);
            delete series.seasons;
            return myLibrary.addSeries(series, episodes);
        })
};

module.exports = TvshowsApi;