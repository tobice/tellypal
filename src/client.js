require('./utils/promisifySuperagent');
require('../config.js');

var React = require('react');
var Fetcher = require('fetchr');
var TellyPal = require('./TellyPal');

window.React = React; // For chrome dev tool support

var fetcher = new Fetcher({ xhrPath: TellyPal.config.xhrPath });
var tellyPal = new TellyPal({ fetcher: fetcher });

window.context = tellyPal.context;

React.renderComponent(tellyPal.getRoutes(), document);