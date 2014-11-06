var WebSocketServer = require('ws').Server;
var debug = require('debug')('ws');

var torrentWs = function(port) {
    port = port || 3001;

    var wss = new WebSocketServer({port: port});
    wss.on('connection', function (ws) {
        debug('Created WebSocket Connection connection om port %s', port);
    });

    setInterval(function () {
        for (var i in wss.clients) {
            if (wss.clients.hasOwnProperty(i)) {
                debug('Sending data to a client %s', i);
                wss.clients[i].send('Hello');
            }
        }
    }, 1000);
};

module.exports = torrentWs;