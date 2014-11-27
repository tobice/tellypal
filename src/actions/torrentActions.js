var socket = require('../utils/socketClient');
var TORRENTUI_STORE = require('../stores/TorrentUIStore').storeName;

var torrentActions = {

    downloadEpisode: function (flux, params) {
        var torrents = flux.getApi('TorrentsApi');
        return torrents.call('downloadEpisode', params.seriesid, params.season, params.episode, params.quality);
    },

    updateUi: function (flux, uiState) {
        flux.dispatch('TORRENTUI_UPDATE_STATE', uiState);
    }
};

module.exports = torrentActions;