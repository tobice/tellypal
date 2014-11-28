var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');
var db = require('../utils/db');

var myLibrary = {

    addSeries: function (series) {
        var episodes = [];
        _.each(series.seasons, function (season) {
            _.each(season, function (episode) {
                // Remember the series name with the episode to improve
                // querying
                episode.SeriesName = series.SeriesName;
                episodes.push(episode);
            })
        });

        return db.Episode.insert(episodes)
            .then(function() {
                delete series.seasons;
                return db.Series.insert(series);
            })
    },

    addDownloadJob: function (hash, seriesid, SeriesName, jobDescription) {
        return db.DownloadJob.remove({hash: hash})
            .then(function() {
                return db.DownloadJob.insert({
                    hash: hash,
                    seriesid: seriesid,
                    SeriesName: SeriesName,
                    jobDescription: jobDescription
                });
            })
    },

    getDownloadJob: function (hash) {
        return new Promise(function (resolve) {
            var query = db.DownloadJob.find({hash: hash});
            resolve(query.first());
        });
    },

    getFinishedDownloadJobs: function (limit) {
        return new Promise(function (resolve) {
            var query = db.DownloadJob.find({});
            query = query
                .filter(function (job) {
                    return job.finished;
                })
                .sort('finished', -1)
                .limit(limit);
            resolve(query.toArray());
        });
    },

    setDownloadJobFinished: function (hash) {
        var query = db.DownloadJob.find({hash: hash});
        return query.update({ finished: moment().format() });
    }
};

module.exports = myLibrary;