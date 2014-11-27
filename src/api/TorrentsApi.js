var debug = require('debug')('tellypal:torrentApi');
var _ = require('lodash');
var printf = require('printf');
var Promise = require('bluebird');

var consts = require('./../consts');
var notifications = require('./../libs/notifications');
var tvdb = require('./../libs/tvdb');
var torrentz = require('./../libs/torrentz');
var myLibrary = require('./../libs/myLibrary');
var deluge = require('../libs/deluge');
var config = require('../../config');
var seriesHelpers = require('../utils/seriesHelpers.jsx');

function TorrentsApi(req, config) {
    this.req = req;
    this.config = config;
}

TorrentsApi.prototype.remove = function (hash, withData) {
    return deluge.call('core.remove_torrent', [hash, withData]);
};

TorrentsApi.prototype.pause = function (hash) {
    return deluge.call('core.pause_torrent', [[hash]]);
};

TorrentsApi.prototype.resume = function (hash) {
    return deluge.call('core.resume_torrent', [[hash]]);
};

TorrentsApi.prototype.downloadEpisode = function (seriesid, season, episode, quality) {
    var torrent, series, query;
    debug('Looking for series');

    // Find series
    return tvdb.getSeries(seriesid)

        // Find torrent file using Torrentz
        .then(function (s) {
            debug('Found series %s', s.SeriesName);
            series = s;
            query = seriesHelpers.makeQueryForEpisode(series.SeriesName, season, episode, quality);
            return torrentz.search(query);
        })
        .catch(function (error) {
            debug('Torrentz search failed: ' + error);
            throw new Error('Searching for torrent using Torrentz failed');
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
            var jobDescription = printf("%ix%i %s", season, episode, series.seasons[season][episode].EpisodeName);
            return myLibrary.addDownloadJob(torrent.hash, seriesid, series.SeriesName, jobDescription);
        })

        // Return torrent being downloaded
        .then(function () {
            debug('New download job added to database');

            // Just to follow the naming conventions from what updateUi() would
            // return. We can't actually use updateUi() now to return full
            // torrent record, as the torrent might not be yet initialized in
            // the Deluge client.
            torrent.name = torrent.title;
            return torrent;
        })

        // Send notification
        .then(function (torrent) {
            var message = 'Torrent ' + torrent.name + ' has been added for download';
            notifications.notify('Downloading started!', message, consts.INFO);
            return torrent;
        })

        .catch(function (error) {
            debug(error);
            throw error;
        });
};

TorrentsApi.prototype.updateUi = function () {
    var uiState;

    return deluge.updateUi()
        .then(function (_uiState) {
            uiState = _uiState;

            // For each torrent identified by its hash lets fetch all files
            return Promise.props(_.mapValues(uiState.torrents, function (torrent, hash) {
                return deluge.getTorrentFiles(hash);
            }));
        })
        .then(function (files) {
            // Attach files to the uiState object
            _.each(files, function(content, hash) {
                uiState.torrents[hash].files = content;
            });

            // For each torrent identified by its hash lets fetch download job
            return Promise.props(_.mapValues(uiState.torrents, function (torrent, hash) {
                return myLibrary.getDownloadJob(hash)
            }));
        })
        .then(function (jobs) {
            // Attach downloadJobs to the uiState object
            _.each(jobs, function (job, hash) {
                uiState.torrents[hash].job = job;
            });

            return uiState;
        });
};

new TorrentsApi().updateUi().then();


module.exports = TorrentsApi;