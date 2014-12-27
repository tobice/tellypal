var DelugeClient = require('deluge-client');
var config = require('../../config');

// Instantiate new connection to deluge
var client = module.exports = new DelugeClient(config.deluge);