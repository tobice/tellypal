require('node-jsx').install({extension: '.jsx'});
require('./utils/promisifySuperagent');
require('../config.js');

var React = require('react');
var Router = require('react-router');
var Fetcher = require('fetchr');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var TellyPal = require('./TellyPal.js');
var bannerProxy = require('./utils/bannerProxy');
var fetcherizeApi = require('./utils/fetcherizeApi');

console.log(fetcherizeApi(require('./api/tvshowsApi')).name);
Fetcher.registerFetcher(fetcherizeApi(require('./api/tvshowsApi')));

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));
app.use(TellyPal.config.xhrPath, Fetcher.middleware());
app.use('/banner/:seriesid/:type.jpg', bannerProxy.middleware);

app.use(function (req, res) {
    var fetcher = new Fetcher({ req: req });
    var tellyPal = new TellyPal({ fetcher: fetcher });

    Router.renderRoutesToString(tellyPal.getRoutes(), req.path, function (err, abortReason, html) {
        // var name = tellyPal.context.getActionContext().getStore('SeriesStore').getContents().series.SeriesName;
        res.send('<!doctype html>' + html);
    });
});

var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port %d', server.address().port);
});

