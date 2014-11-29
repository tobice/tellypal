var util = require('util');
var _ = require('lodash');
var BaseStore = require('dispatchr/utils/BaseStore');

function SeriesStore(dispatcher) {
    this.dispatcher = dispatcher;
    this._series = {};
}

SeriesStore.storeName = 'SeriesStore';
SeriesStore.handlers = {
    'SERIES_ADD': 'addSeries',
    'SERIES_ADD_SEASON': 'addSeason',
    'SERIES_CLEAR': 'clear'
};

util.inherits(SeriesStore, BaseStore);

SeriesStore.prototype.getMyLibrary = function () {
    return _.filter(this._series, { inMyLibrary: true });
};

SeriesStore.prototype.addSeries = function (payload) {
    var series = payload.series;

    // Check for preloaded seasons
    var seasons = {};
    if (this._series[series.id]) {
        seasons = this._series[series.id].seasons;
    }

    this._series[series.id] = series;
    this._series[series.id].seasons = seasons;
    this.emitChange();
};

SeriesStore.prototype.getSeries = function (id) {
    return this._series[id];
};

SeriesStore.prototype.hasSeries = function (id) {
    // Check if series exists and it's not just a stub
    return this._series.hasOwnProperty(id) && this._series[id].SeriesName;
};

SeriesStore.prototype.addSeason = function (payload) {
    var seriesid = payload.seriesid;
    var season = payload.season;
    var episodes = payload.episodes;

    // Create series stub in case a proper series record does not exist
    if (!this._series.hasOwnProperty(seriesid)) {
        this._series[seriesid] = { seasons: {} };
    }

    this._series[seriesid].seasons[season] = episodes;
    this.emitChange();
};

SeriesStore.prototype.getSeason = function (seriesid, season) {
    if (!this._series.hasOwnProperty(seriesid)) {
        return null;
    }
    return this._series[seriesid].seasons[season];
};

SeriesStore.prototype.hasSeason = function (seriesid, season) {
    return this._series.hasOwnProperty(seriesid)
        && this._series[seriesid].seasons
        && this._series[seriesid].seasons.hasOwnProperty(season);
};

SeriesStore.prototype.clear = function () {
    this._series = {};
    this.emitChange();
};

SeriesStore.prototype.dehydrate = function () {
    return {
        series: this.series
    };
};

SeriesStore.prototype.rehydrate = function (state) {
    this.series = state.series;
};

module.exports = SeriesStore;
