var printf = require('printf');
var tvdb = require('./../libs/tvdb');
var torrentz = require('./../libs/torrentz');
var myLibrary = require('./../libs/myLibrary');
var deluge = require('../libs/deluge');
var config = require('../../config');
var debug = require('debug')('tellypal:torrentApi');

function makeQueryForEpisode(SeriesName, season, episode, quality) {
    return printf("%s S%02iE%02i %s", SeriesName, season, episode, quality);
}

function TorrentsApi(req, config) {
    this.req = req;
    this.config = config;
}

TorrentsApi.prototype.downloadEpisode = function (seriesid, season, episode, quality) {
    var torrent, series, query;
    debug('Looking for series');

    // Find series
    return tvdb.getSeries(seriesid)

        // Find torrent file using Torrentz
        .then(function (s) {
            debug('Found series %s', s.SeriesName);
            series = s;
            query = makeQueryForEpisode(series.SeriesName, season, episode, quality);
            return torrentz.search(query);
        })

        // Add torrent to deluge
        .then(function (torrents) {
            if (torrents.length == 0) {
                throw new Error('No torrents found');
            }
            debug('Found torrent %s', torrents[0].title);
            torrent = torrents[0];
            return deluge.addTorrent(torrent.magnetLink, {download_location: config.downloadDir});
        })

        // Add new download job to local database
        .then(function () {
            debug('Torrent added to Deluge');
            var jobDescription = printf("Season %i, Episode %i", season, episode);
            return myLibrary.addDownloadJob(torrent.hash, seriesid, series.SeriesName, jobDescription);
        })

        // Return torrent being downloaded
        .then(function () {
            debug('New download job added to database');
            return torrent;
        });
};

module.exports = TorrentsApi;