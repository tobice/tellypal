var debug = require('debug')('torrentWs');
var NotificationStore = require('../stores/NotificationStore');
var TORRENTUI_STORE = require('../stores/TorrentUIStore').storeName;

var torrentActions = {

    downloadEpisode: function (context, params) {
        var torrents = context.getApi('TorrentsApi');
        return torrents.call('downloadEpisode', params.seriesid, params.season, params.episode, params.quality);
    },

    updateUi: function (context) {
        var host = window.document.location.host.replace(/:.*/, '');
        var ws = new WebSocket('ws://' + host + ':3001'); // TODO: ports from config
        var torrentUIStore = context.getStore(TORRENTUI_STORE);
        ws.onopen = function () {
            debug('Opened WebSocket connection for updating Torrent client UI');
        };
        ws.onclose = function () {
            debug('Closed WebSocket connection for updating Torrent client UI');
            context.notify('Lost connection!', 'Connection to the TellyPal server has been lost. Refresh to reconnect.', NotificationStore.DANGER);
        };
        ws.onmessage = function (event) {
            var state = JSON.parse(event.data);
            var torrents = state.torrents;

            // Compare new state with the old one and find if any torrent has
            // finished. If so, display user notification.
            for (var hash in torrents) {
                if (torrents.hasOwnProperty(hash)) {
                    var torrent = torrentUIStore.getTorrent(hash);
                    if (torrent && torrent.progress != 100 && torrents[hash].progress == 100) {
                        var message = 'Torrent ' + torrent.name + ' has been successfully downloaded.';
                        context.notify('Torrent finished!', message, NotificationStore.SUCCESS);
                    }
                }
            }

            context.dispatch('TORRENTUI_UPDATE_STATE', JSON.parse(event.data));
        };
    }
};

module.exports = torrentActions;