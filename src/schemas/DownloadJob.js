var warehouse = require('warehouse');
var Schema = warehouse.Schema;

var downloadJob = new Schema({
    hash: String,
    seriesid: Number,
    SeriesName: String,
    jobDescription: String,
    finished: String
});

module.exports = downloadJob;