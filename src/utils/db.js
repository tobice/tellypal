var config = require('../../config');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var debug = require('debug')('mongodb');
Promise.promisifyAll(mongoose);

var dbURI = config.mongodbURI;
mongoose.connect('mongodb://localhost/tellypal');

mongoose.connection.on('connected', function () {
    debug('Mongoose default connection open to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    debug('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    debug('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        debug('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

