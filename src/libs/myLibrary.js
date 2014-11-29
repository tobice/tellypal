var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');
var db = require('../utils/db');

var myLibrary = {

    addSeries: function (series, episodes) {
        series.inMyLibrary = true;

        _.each(episodes, function (episode) {
            // Remember the series name with the episode to improve
            // querying
            episode.SeriesName = series.SeriesName;
            episode.inMyLibrary = true;
        });

        return this.getSeries(series.id)
            .then(function (series) {
                if (series) {
                    throw new Error('Series already exists in the library!');
                }
                return db.Episode.insert(episodes)
            })
            .then(function() {
                delete series.seasons;
                return db.Series.insert(series);
            })
    },

    getSeries: function (seriesid) {
        return new Promise(function (resolve) {
            var query = db.Series.find({id: seriesid});
            resolve(query.first());
        });
    },

    getEpisodes: function (seriesid) {
        return new Promise(function (resolve) {
            var query = db.Episode.find({seriesid: seriesid});
            resolve(query.toArray());
        });
    },

    getSeason: function (seriesid, season) {
        return new Promise(function (resolve) {
            var query = db.Episode.find({Combined_season: season});
            resolve(query.toArray());
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