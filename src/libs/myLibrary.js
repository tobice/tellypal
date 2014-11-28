var Promise = require('bluebird');
var moment = require('moment');
var db = require('../utils/db');

var myLibrary = {

    addDownloadJob: function (hash, seriesid, SeriesName, jobDescription) {
        return db.DownloadJob.remove({hash: hash})
            .then(function() {
                db.DownloadJob.insert({
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
        return new Promise(function (resolve) {
            var query = db.DownloadJob.find({hash: hash});
            query.update({ finished: moment().format() });
            resolve();
        });
    }
};

module.exports = myLibrary;