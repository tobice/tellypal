var request = require('superagent');
var xmlHelpers = require('../utils/xmlHelpers');
var _ = require('lodash');
var url = require('url');
var merge = require('merge');
var printf = require('printf');
var Promise = require('bluebird');
var bl = require("bl");

var SEARCH_URL = 'https://torrentz.eu/feed';
var VERIFIED_SEARCH_URL = 'https://torrentz.eu/feed_verified';
var TRACKER = 'udp://tracker.openbittorrent.com/announce';

function makeUrl (q, minSeeds) {
    var torrentz = url.parse(VERIFIED_SEARCH_URL);
    if (minSeeds) {
        q += ' seed > ' + minSeeds;
    }
    torrentz.query = {q: q};
    return url.format(torrentz);
}

function parseDescription(description) {
    var matches = /^Size: (\d+) MB Seeds: ([\d,]+) Peers: ([\d,]+) Hash: ([\w\d]+)$/.exec(description);
    return {
        size: parseInt(matches[1]),
        seeds: parseInt(matches[2].replace(/,/g, '')),
        peers: parseInt(matches[3].replace(/,/g, '')),
        hash: matches[4]
    };
}

function makeMagnetLink(hash, name) {
    return printf('magnet:?xt=urn:btih:%s&dn=%s&tr=%s', hash, encodeURIComponent(name), encodeURIComponent(TRACKER));
}

var torrentz = {

    search: function (q, minSeeds) {
        return request(makeUrl(q, minSeeds))
            // Torrentz doesn't use any content-type which results in superagent
            // returning empty response.body. Setting .buffer(true) fixes that.
            .buffer(true).promise()
            .then(xmlHelpers.parseXMLResponse)
            .then(function (json) {
                return json.rss.channel[0].item;
            })
            .then(xmlHelpers.cleanObjects)
            .then(function (torrents) {
                torrents.forEach(function (torrent) {
                    torrent = merge(torrent, parseDescription(torrent.description));
                    torrent.magnetLink = makeMagnetLink(torrent.hash, torrent.title);
                });

                return torrents;
            });
    },

    getTorrentFileUrl: function (hash) {
        return 'http://torcache.net/torrent/' + hash + '.torrent'
    },

    getTorrentFile: function (hash) {
        var url = this.getTorrentFileUrl(hash);

        return new Promise(function (resolve, reject) {
           request.get(url).pipe(bl(function (err, buffer) {
               if (err) {
                   reject(new Error('Downloading torrent failed. ' + err.message));
                   return;
               }
               resolve(buffer);
           }));
        });
    }
};

module.exports = torrentz;