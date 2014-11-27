var fs = require('fs');
var warehouse = require('warehouse');
var debug = require('debug')('tellypal:db');
var _ = require('lodash');

var config = require('../../config');
var DownloadJobSchema = require('../schemas/DownloadJob');
var NotificationSchema = require('../schemas/Notification');

var db = new warehouse({ path: config.db });
if (fs.existsSync(config.db)) {
    load();
}

function load() {
    db.load().then(function () {
        debug('Database loaded');
    })
}

function save() {
    db.save().then(function () {
        debug('Database saved');
    })
}

// Create database schema
var models = {
    DownloadJob: db.model('downloadJob', DownloadJobSchema),
    Notification: db.model('notification', NotificationSchema)
};

// Make sure that the database gets saved to the disk every time the model is
// changed
_.each(models, function (model) {
    model.addListener('insert', save);
    model.addListener('update', save);
    model.addListener('remove', save);
});

module.exports = models;
