var SeriesStore = require('../stores/SeriesStore');
var NotificationStore = require('../stores/NotificationStore');

var seriesActions = {

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
                flux.notify('Error', 'Failed to load the series', NotificationStore.DANGER);
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
                flux.notify('Error', 'Failed to load the season', NotificationStore.DANGER);
            })
    }
};

module.exports = seriesActions;