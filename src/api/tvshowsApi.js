var tvdb = require('./../libs/tvdb');
var Promise = require('bluebird');

function TvshowsApi (req, config) {
    this.req = req;
    this.config = config;
}

TvshowsApi.prototype.searchSeries = function (search) {
    return tvdb.searchSeries(search);
};

TvshowsApi.prototype.getSeason = function (seriesid, season) {
    return tvdb.getSeason(seriesid, season);
};

TvshowsApi.prototype.getSeries = function (seriesid) {
    return tvdb.getSeries(seriesid)
        .then(function (series) {
            // Remove list of episodes to lower the traffic
            series.seasons = null;
            return series;
        });
};

module.exports = TvshowsApi;