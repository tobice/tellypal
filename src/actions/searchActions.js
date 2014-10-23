var SearchStore = require('../stores/SearchStore');

var searchActions = {

    /**
     * @param {object} context
     * @param {string} query - String to search for
     */
    search: function (context, query) {
        var tvshows = context.getApi('tvshows');
        context.dispatch('SEARCH_CLEAR');
        return tvshows.read({ search: query }).then(function (results) {
            context.dispatch('SEARCH', { results: results });
        });
    }
};

module.exports = searchActions;