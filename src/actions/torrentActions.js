var debug = require('debug')('torrentWs');
var NotificationStore = require('../stores/NotificationStore');

var torrentActions = {

    downloadEpisode: function (context, params) {
        var torrents = context.getApi('TorrentsApi');
        return torrents.call('downloadEpisode', params.seriesid, params.season, params.episode, params.quality);
    },

    updateUi: function (context) {
        var host = window.document.location.host.replace(/:.*/, '');
        var ws = new WebSocket('ws://' + host + ':3001'); // TODO: ports from config
        ws.onopen = function () {
            debug('Opened WebSocket connection for updating Torrent client UI');
        };
        ws.onclose = function () {
            debug('Closed WebSocket connection for updating Torrent client UI');
            context.notify('Lost connection!', 'Connection to the TellyPal server has been lost. Refresh to reconnect.', NotificationStore.DANGER);
        };
        ws.onmessage = function (event) {
            debug('Received data %s', event.data);
        };
    }
};

module.exports = torrentActions;