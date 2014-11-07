var WebSocketServer = require('ws').Server;
var debug = require('debug')('ws');
var TorrentApi = require('./api/TorrentsApi');

var torrentWs = function(port) {
    port = port || 3001;

    var torrentApi = new TorrentApi();
    var wss = new WebSocketServer({port: port});
    wss.on('connection', function (ws) {
        debug('Created WebSocket Connection connection on port %s', port);
    });

    setInterval(function () {
        if (wss.clients.length > 0) {
            torrentApi.updateUi().then(function (uiState) {
                var json = JSON.stringify(uiState);
                for (var i in wss.clients) {
                    if (wss.clients.hasOwnProperty(i)) {
                        wss.clients[i].send(json);
                    }
                }
            });
        }
    }, 1000);
};

module.exports = torrentWs;