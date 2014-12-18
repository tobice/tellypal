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

    updateSeries: function (series, episodes) {
        return this.getSeries(series.id)

            // Update series record
            .then(function (series) {
                if (!series) {
                    throw new Error('Series does not exist in the library!');
                }
                return db.Series.find({id: series.id}).update(series)
            })

            // Update episode records
            .then(function () {
                return Promise.all(_.map(episodes, function (episode) {
                    var query = db.Episode.find({id: episode.id});

                    // Insert new episodes
                    if (query.length == 0) {
                        episode.SeriesName = series.SeriesName;
                        episode.inMyLibrary = true;
                        db.Episode.insert(episode);

                    // Update old ones
                    } else {
                        query.update(episode);
                    }
                }));
            })
    },

    getSeries: function (seriesid) {
        return db.ready.then(function () {
            if (seriesid) {
                return db.Series.find({id: seriesid}).first();
            } else {
                return db.Series.find({}).toArray();
            }
        });
    },

    getEpisodes: function (seriesid) {
        return db.ready.then(function () {
            var query = db.Episode.find({seriesid: seriesid});
            return query.toArray();
        });
    },

    getSeason: function (seriesid, season) {
        return db.ready.then(function () {
            var query = db.Episode.find({seriesid: seriesid.toString(), Combined_season: season.toString()});
            return query.toArray();
        });
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
        return db.ready.then(function () {
            var query = db.DownloadJob.find({hash: hash});
            return query.first();
        });
    },

    getFinishedDownloadJobs: function (limit) {
        return db.ready.then(function () {
            var query = db.DownloadJob.find({});
            query = query
                .filter(function (job) {
                    return job.finished;
                })
                .sort('finished', -1)
                .limit(limit);
            return query.toArray();
        });
    },

    setDownloadJobFinished: function (hash) {
        var query = db.DownloadJob.find({hash: hash});
        return query.update({ finished: moment().format() });
    },

    getMeta: function () {
        return db.ready.then(function () {
            return db.Meta.first();
        });
    },

    updateMeta: function (update) {
        return this.getMeta()
            .then(function (meta) {
                if (meta) {
                    return db.Meta.update({}, update);
                } else {
                    return db.Meta.insert(update);
                }
            })
    },

    /**
     * @returns {Promise.<moment>}
     */
    getLastLibraryUpdate: function () {
        return this.getMeta()
            .then(function (meta) {
                if (meta) {
                    return moment(meta.lastLibraryUpdate);
                } else {
                    return moment(0);
                }
            });
    },

    setLastLibraryUpdate: function (date) {
        if (!date) {
            date = moment();
        }
        return this.updateMeta({
            lastLibraryUpdate: date.format()
        });
    }
};

module.exports = myLibrary;