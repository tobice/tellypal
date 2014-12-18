var fs = require('fs');
var warehouse = require('warehouse');
var debug = require('debug')('tellypal:db');
var _ = require('lodash');
var Promise = require('bluebird');

var config = require('../../config');
var DownloadJobSchema = require('../schemas/DownloadJob');
var NotificationSchema = require('../schemas/Notification');
var SeriesSchema = require('../schemas/Series');
var EpisodeSchema = require('../schemas/Episode');
var MetaSchema = require('../schemas/Meta');

var db = new warehouse({ path: config.db });

// Use promise to store the db loading status so we can detect the moment
// when the database is loaded and we can start using it
var ready;
if (fs.existsSync(config.db)) {
    ready = load();
} else {
    ready = Promise.resolve();
}

function load() {
    return db.load().then(function () {
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

var delayedSave = _.debounce(save, 1000);

// Create database schema
var models = {
    DownloadJob: db.model('downloadJob', DownloadJobSchema),
    Notification: db.model('notification', NotificationSchema),
    Episode: db.model('episode', EpisodeSchema),
    Series: db.model('series', SeriesSchema),
    Meta: db.model('meta', MetaSchema)
};

// Make sure that the database gets saved to the disk every time the model is
// changed
_.each(models, function (model) {
    model.addListener('insert', delayedSave);
    model.addListener('update', delayedSave);
    model.addListener('remove', delayedSave);
});

module.exports = models;
module.exports.ready = ready;
