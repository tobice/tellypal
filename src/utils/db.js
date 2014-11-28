var fs = require('fs');
var warehouse = require('warehouse');
var debug = require('debug')('tellypal:db');
var _ = require('lodash');

var config = require('../../config');
var DownloadJobSchema = require('../schemas/DownloadJob');
var NotificationSchema = require('../schemas/Notification');
var SeriesSchema = require('../schemas/Series');
var EpisodeSchema = require('../schemas/Episode');

var db = new warehouse({ path: config.db });
if (fs.existsSync(config.db)) {
    load();
}

function load() {
    db.load().then(function () {
        debug('Database loaded');
    })
}

var savingPromise;
function save() {
    if (!savingPromise) {
        savingPromise = db.save();
    } else {
        savingPromise = savingPromise.then(db.save.bind(db));
    }
    savingPromise.then(function () {
        debug('Database saved');
    });
}

// Create database schema
var models = {
    DownloadJob: db.model('downloadJob', DownloadJobSchema),
    Notification: db.model('notification', NotificationSchema),
    Episode: db.model('episode', EpisodeSchema),
    Series: db.model('series', SeriesSchema)
};

// Make sure that the database gets saved to the disk every time the model is
// changed
_.each(models, function (model) {
    model.addListener('insert', save);
    model.addListener('update', save);
    model.addListener('remove', save);
});

module.exports = models;
