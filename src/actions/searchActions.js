var SearchStore = require('../stores/SearchStore');

var searchActions = {

    /**
     * @param {object} flux
     * @param {string} query - String to search for
     */
    search: function (flux, query) {
        var tvshows = flux.getApi('TvshowsApi');
        flux.dispatch('SEARCH_CLEAR');
        return tvshows.call('searchSeries', query).then(function (results) {
            flux.dispatch('SEARCH', { results: results });
        });
    }
};

module.exports = searchActions;