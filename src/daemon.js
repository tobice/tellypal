var TorrentApi = require('./api/TorrentsApi');
var socket = require('./utils/socketServer');
var torrentApi = new TorrentApi();

var daemon = {

    updateUi: function () {
        if (socket.isSomeoneConnected()) {
            torrentApi.updateUi().then(function (uiState) {
                socket.send('updateUi', uiState);
            });
        }
    },

    run: function () {
        setInterval(this.updateUi, 1000);
    }
};

module.exports = daemon;

