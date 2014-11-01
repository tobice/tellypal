var DownloadJob = require('../model/DownloadJob');
require('../utils/db');

var myLibrary = {

    addDownloadJob: function (hash, seriesid, SeriesName, jobDescription) {
        return new DownloadJob({
            hash: hash,
            seriesid: seriesid,
            SeriesName: SeriesName,
            jobDescription: jobDescription
        }).saveAsync();
    }
};

module.exports = myLibrary;