var consts = require('../consts');
var socket = require('../utils/socketClient');
var TORRENTUI_STORE = require('../stores/TorrentUIStore').storeName;

var torrentActions = {

    downloadEpisode: function (flux, params) {
        var torrents = flux.getApi('TorrentsApi');
        return torrents.call('downloadEpisode', params.seriesid, params.season, params.episode, params.quality)
            .catch(function (err) {
                flux.notify('Downloading episode failed', err.responseText, consts.DANGER);
            });
    },

    updateUi: function (flux, uiState) {
        flux.dispatch('TORRENTUI_UPDATE_STATE', uiState);
    },

    resume: function (flux, hash) {
        var torrents = flux.getApi('TorrentsApi');
        return torrents.call('resume', hash);
    },

    pause: function (flux, hash) {
        var torrents = flux.getApi('TorrentsApi');
        return torrents.call('pause', hash);
    },

    remove: function (flux, params) {
        var torrents = flux.getApi('TorrentsApi');
        return torrents.call('remove', params.hash, params.withData);
    }
};

module.exports = torrentActions;