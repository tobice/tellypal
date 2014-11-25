var db = require('../utils/db');
var Promise = require('bluebird');

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
    }
};

module.exports = myLibrary;