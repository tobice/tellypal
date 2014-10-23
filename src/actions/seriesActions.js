var SeriesStore = require('../stores/SeriesStore');

var seriesActions = {

    /**
     * @param {object} context
     * @param {string} seriesid - Series ID to search for
     * @return Promise
     */
    loadSeries: function (context, seriesid) {
        var tvshows = context.getApi('tvshows');
        return tvshows.read({seriesid: seriesid}).then(function (series) {
            context.dispatch('SERIES_ADD', { series: series });
        });
    },

    /**
     * @param {object} context
     * @param {object} params
     * @return Promise
     */
    loadSeason: function (context, params) {
        var tvshows = context.getApi('tvshows');
        return tvshows.read({seriesid: params.seriesid, season: params.season}).then(function (episodes) {
            context.dispatch('SERIES_ADD_SEASON', {
                seriesid: params.seriesid,
                season: params.season,
                episodes: episodes
            });
        })
    }
};

module.exports = seriesActions;