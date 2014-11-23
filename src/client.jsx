require('./utils/promisifySuperagent');
require('../config.js');

var debug = require('debug');
debug.enable('torrentWs');

var Router = require('react-router');
var React = require('react');
var Fetcher = require('fetchr');

var TellyPal = require('./TellyPal');
var AppRoutes = require('./AppRoutes.jsx');
var torrentActions = require('./actions/torrentActions');

window.React = React; // For chrome dev tool support

var fetcher = new Fetcher({ xhrPath: TellyPal.config.xhrPath });
var tellyPal = new TellyPal({ fetcher: fetcher });

window.flux = tellyPal.flux;

Router.run(AppRoutes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler flux={tellyPal.getComponentFlux()} />, document);
});

// Connect to the server and listen to torrent client updates
tellyPal.flux.executeAction(torrentActions.updateUi);