var EventEmitter = require('event-emitter');
var WebSocketServer = require('ws').Server;
var debug = require('debug')('ws');

var ee = EventEmitter();

var wsServer;
var socket = {
    listen: function (port) {
        port = port || 3001;

        wsServer = new WebSocketServer({port: port});
        wsServer.on('connection', function (ws) {
            debug('Created WebSocket Connection connection on port %s', port);
            ee.emit('connection');
        });
    },

    send: function (event, payload) {
        if (!wsServer) {
            throw new Error('Socket has not been initiated');
        }

        var json = JSON.stringify({
            event: event,
            payload: payload
        });

        for (var i in wsServer.clients) {
            if (wsServer.clients.hasOwnProperty(i)) {
                wsServer.clients[i].send(json);
            }
        }
    },

    isSomeoneConnected: function () {
        return wsServer && wsServer.clients.length > 0;
    },

    onConnection: function (listener) {
        ee.on('connection', listener);
    }
};

module.exports = socket;