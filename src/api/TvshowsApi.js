var debug = require('debug')('tellypal:tvshowsApi');
var Promise = require('bluebird');
var _ = require('lodash');
var tvdb = require('../libs/tvdb');
var myLibrary = require('../libs/myLibrary');
var seriesHelpers = require('../utils/seriesHelpers.jsx');
var config = require('../../config');

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

TvshowsApi.prototype.getMyLibrary = function () {
    return myLibrary.getSeries();
};

TvshowsApi.prototype.addSeriesToLibrary = function (seriesid) {
    return tvdb.getSeries(seriesid)
        .then(function (series) {
            var episodes = seriesHelpers.seasonsToEpisodes(series.seasons);
            delete series.seasons;
            return myLibrary.addSeries(series, episodes);
        })
};

TvshowsApi.prototype.updateSeries = function (seriesid) {
    var name;
    return tvdb.getSeries(seriesid)
        .then(function (series) {
            var episodes = seriesHelpers.seasonsToEpisodes(series.seasons);
            name = series.SeriesName;
            delete series.seasons;
            return myLibrary.updateSeries(series, episodes);
        })
        .then(function () {
            debug('Series %s has been updated', name);
        })
};

TvshowsApi.prototype.updateLibrary = function () {
    var self = this;
    return myLibrary.getSeries()
        .then(function (seriesArray) {
            return Promise.all(_.map(seriesArray, function (series) {
                return self.updateSeries(series.id);
            }));
        })
        .then(function () {
            myLibrary.setLastLibraryUpdate();
        })
};

TvshowsApi.prototype.isLibraryOutDated = function () {
    return myLibrary.getLastLibraryUpdate()
        .then(function (date) {
            var nextUpdate = date.add(config.libraryUpdateEvery);
            return nextUpdate.isBefore(); // ...is before "now"
        })
};

module.exports = TvshowsApi;