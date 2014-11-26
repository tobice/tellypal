var EventEmitter = require('event-emitter');
var debug = require('debug')('tellyPal:socket');
var config = require('../../config');
var consts = require('../consts');

var ee = EventEmitter();

var socket = {
    connect: function (port, flux) {
        var host = window.document.location.host.replace(/:.*/, '');
        var ws = new WebSocket('ws://' + host + ':' + port);

        ws.onopen = function () {
            debug('Opened WebSocket connection');
        };

        ws.onclose = function () {
            debug('Closed WebSocket connection!');
            flux.notify('Lost connection!', 'Connection to the TellyPal server has been lost. Refresh to reconnect.', consts.DANGER);
        };

        ws.onmessage = function (message) {
            var event = JSON.parse(message.data);
            ee.emit(event.event, event.payload);
        };
    },

    addListener: function (event, listener) {
        ee.on(event, listener)
    }
};

module.exports = socket;