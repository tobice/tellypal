var _ = require('lodash');
var TorrentApi = require('./api/TorrentsApi');
var socket = require('./utils/socketServer');
var notifications = require('./libs/notifications');
var torrentApi = new TorrentApi();

var daemon = {

    updateUi: function () {
        if (socket.isSomeoneConnected()) {
            torrentApi.updateUi().then(function (uiState) {
                socket.send('updateUi', uiState);
            });
        }
    },

    flushNotifications: function () {
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
    }
};

module.exports = daemon;

