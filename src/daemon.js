var _ = require('lodash');
var TorrentApi = require('./api/TorrentsApi');
var TvshowsApi = require('./api/TvshowsApi');
var socket = require('./utils/socketServer');
var notifications = require('./libs/notifications');
var myLibrary = require('./libs/myLibrary');
var torrentApi = new TorrentApi();
var tvshowsApi = new TvshowsApi();
var consts = require('./consts');

var oldUiState;

var daemon = {

    updateLibrary: function () {
        tvshowsApi.updateLibrary();
    },

    updateUi: function () {
        torrentApi.updateUi().then(function (uiState) {
            // Compare the new state with the old one and find if any
            // torrent has finished. If so, display user notification.
            if (oldUiState) {
                var torrents = uiState.torrents;
                for (var hash in torrents) {
                    if (torrents.hasOwnProperty(hash)) {
                        var torrent = oldUiState.torrents[hash];
                        if (torrent && torrent.progress != 100 && torrents[hash].progress == 100) {
                            var message = 'Torrent ' + torrent.name + ' has been successfully downloaded.';
                            notifications.notify('Torrent finished!', message, consts.SUCCESS);
                            myLibrary.setDownloadJobFinished(hash);
                            torrentApi.remove(hash, false);
                        }
                    }
                }
            }

            oldUiState = uiState;
            socket.send('updateUi', uiState);
        });
    },

    flushNotifications: function () {
        // I have to be sure that there is some one to whom I can show the
        // notifications (otherwise I will just wait until somebody connects)
        if (socket.isSomeoneConnected()) {
            _.each(notifications.flushNew(), function (notification) {
                socket.send('notify', notification);
            });
        }
    },

    run: function () {
        setInterval(this.updateUi, 1000);
        notifications.onNewNotification(this.flushNotifications);
        socket.onConnection(this.flushNotifications);

        this.updateLibrary();
    }
};

module.exports = daemon;

