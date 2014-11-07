var DownloadJob = require('../model/DownloadJob');
require('../utils/db');

var myLibrary = {

    addDownloadJob: function (hash, seriesid, SeriesName, jobDescription) {
        DownloadJob.removeAsync({ hash: hash})
            .then(function () {
                return new DownloadJob({
                    hash: hash,
                    seriesid: seriesid,
                    SeriesName: SeriesName,
                    jobDescription: jobDescription
                }).saveAsync();
            })
    },

    getDownloadJob: function (hash) {
        return DownloadJob.findAsync({ hash: hash });
    }
};

module.exports = myLibrary;