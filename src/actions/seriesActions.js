var _ = require('lodash');
var SeriesStore = require('../stores/SeriesStore');
var consts = require('../consts');

var seriesActions = {

    addSeriesToLibrary: function (flux, seriesid) {
        var tvshows = flux.getApi('TvshowsApi');
        return tvshows.call('addSeriesToLibrary', seriesid)
            .then(function () {
                flux.notify('Success', 'The series has been added to your library', consts.SUCCESS);
            })
            .catch(function (error) {
                console.log(error);
                flux.notify('Error', error.message, consts.DANGER);
            });
    },

    loadMyLibrary: function (flux) {
        var tvshows = flux.getApi('TvshowsApi');
        return tvshows.call('getMyLibrary')
            .then(function (series) {
                _.each(series, function (s) {
                    flux.dispatch('SERIES_ADD', {series: s});
                });
            });
    },

    /**
     * @param {object} flux
     * @param {string} seriesid - Series ID to search for
     * @return Promise
     */
    loadSeries: function (flux, seriesid) {
        var tvshows = flux.getApi('TvshowsApi');
        return tvshows.call('getSeries', seriesid)
            .then(function (series) {
                flux.dispatch('SERIES_ADD', { series: series });
            })
            .catch(function (error) {
                console.log(error);
                flux.notify('Error', error.message, consts.DANGER);
            });
    },

    /**
     * @param {object} flux
     * @param {object} params
     * @return Promise
     */
    loadSeason: function (flux, params) {
        var tvshows = flux.getApi('TvshowsApi');
        return tvshows.call('getSeason', params.seriesid, params.season)
            .then(function (episodes) {
                flux.dispatch('SERIES_ADD_SEASON', {
                    seriesid: params.seriesid,
                    season: params.season,
                    episodes: episodes
                });
            })
            .catch(function (error) {
                console.log(error);
                flux.notify('Error', error.message, consts.DANGER);
            })
    }
};

module.exports = seriesActions;