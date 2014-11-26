require('./utils/promisifySuperagent');

var Router = require('react-router');
var React = require('react');
var Fetcher = require('fetchr');

var config = require('../config.js');
var TellyPal = require('./TellyPal');
var AppRoutes = require('./AppRoutes.jsx');
var socket = require('./utils/socketClient');
var torrentActions = require('./actions/torrentActions');

window.React = React; // For chrome dev tool support

var fetcher = new Fetcher({ xhrPath: TellyPal.config.xhrPath });
var tellyPal = new TellyPal({ fetcher: fetcher });

window.flux = tellyPal.flux;

Router.run(AppRoutes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler flux={tellyPal.getComponentFlux()} />, document);
});

// Connect to the server and listen for messages
socket.connect(config.socketPort, tellyPal.flux);
socket.addListener('updateUi', function (payload) {
    tellyPal.flux.executeAction(torrentActions.updateUi, payload);
});
