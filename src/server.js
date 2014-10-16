require('node-jsx').install({extension: '.jsx'});
require('./utils/promisifySuperagent');

var React = require('react');
var Router = require('react-router');
var Fetcher = require('fetchr');
var express = require('express');
var compression = require('compression');

var TellyPal = require('./TellyPal.js');
var bannerProxy = require('./utils/bannerProxy');

Fetcher.registerFetcher(require('./api/tvshowsFetcher'));

var app = express();
app.use(compression());
app.use(express.static(__dirname + '/../public'));
app.use(TellyPal.config.xhrPath, Fetcher.middleware());
app.use('/banner/:seriesid/:type.jpg', bannerProxy.middleware);

app.use(function (req, res) {
    var fetcher = new Fetcher({ req: req });
    var tellyPal = new TellyPal({ fetcher: fetcher });

    Router.renderRoutesToString(tellyPal.getRoutes(), req.path, function (err, abortReason, html) {
        res.send('<!doctype html>' + html);
    });
});

var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port %d', server.address().port);
});

