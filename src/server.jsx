require('./utils/promisifySuperagent');
require('../config.js');
require('./utils/db');

var React = require('react');
var Router = require('react-router');
var Fetcher = require('fetchr');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var TellyPal = require('./TellyPal.js');
var AppRoutes = require('./AppRoutes.jsx');
var torrentWs = require('./torrentWs');
var bannerProxy = require('./utils/bannerProxy');
var fetcherizeApi = require('./utils/fetcherizeApi');

Fetcher.registerFetcher(fetcherizeApi(require('./api/TvshowsApi')));
Fetcher.registerFetcher(fetcherizeApi(require('./api/TorrentsApi')));

var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));
app.use(TellyPal.config.xhrPath, Fetcher.middleware());
app.use('/banner/:seriesid/:type.jpg', bannerProxy.middleware);

app.use(function (req, res) {
    var fetcher = new Fetcher({ req: req });
    var tellyPal = new TellyPal({ fetcher: fetcher });

    Router.run(AppRoutes, req.path, function (Handler) {
        var html = React.renderToString(<Handler flux={tellyPal.getComponentFlux()} />);
        res.send('<!doctype html>' + html);
    });
});

var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port %d', server.address().port);
});

torrentWs(3001);