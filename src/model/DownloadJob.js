var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var downloadJobSchema = new Schema({
    hash: String,
    seriesid: Number,
    SeriesName: String,
    jobDescription: String
});

var DownloadJob = module.exports = mongoose.model('DownloadJob', downloadJobSchema);