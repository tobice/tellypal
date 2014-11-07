require('./utils/promisifySuperagent');
require('../config.js');

var debug = require('debug');
debug.enable('torrentWs');

var React = require('react');
var Fetcher = require('fetchr');
var TellyPal = require('./TellyPal');
var torrentActions = require('./actions/torrentActions');

window.React = React; // For chrome dev tool support

var fetcher = new Fetcher({ xhrPath: TellyPal.config.xhrPath });
var tellyPal = new TellyPal({ fetcher: fetcher });

window.context = tellyPal.context;

React.renderComponent(tellyPal.getRoutes(), document);

// Connect to the server and listen to torrent client updates
tellyPal.context.getActionContext().executeAction(torrentActions.updateUi);