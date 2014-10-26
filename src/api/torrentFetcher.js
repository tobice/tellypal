var Promise = require('bluebird');
var unpromisifyFetcher = require('../utils/unpromisifyFetcher');

var torrentFetcher = {
    name: 'torrentFetcher',

    read: function (req, resource, params) {

    }
};

module.exports = unpromisifyFetcher(torrentFetcher);