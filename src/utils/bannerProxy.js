var debug = require('debug')('bannerProxy');
var request = require('superagent');
var fs = require('fs');
var FileCache = require('./FileCache');
var tvdb = require('../libs/tvdb.js');
var config = require('../../config');

var BANNER_FALLBACK_PATH = './assets/images/banner-fallback/';
var TYPES = {
    poster: { width: 680, height: 1000 },
    fanart: { width: 1920, height: 1080 },
    series: { width: 758, height: 140 },
    season: { width: 400, height: 578 }
};

var imageCache = new FileCache(config.imageCacheDir);

function sendImage(res, imagedata) {
    res.header("Content-Type", "image/jpg");
    res.end(imagedata);
}

function sendFallbackImage(res, type) {
    fs.readFile(BANNER_FALLBACK_PATH + type + '.jpg', function(err, buffer) {
        if (err) {
            debug(err);
            res.header("Content-Type", "text/plain");
            res.status(404).end('Unable to load fallback image');
            return;
        }
        sendImage(res, buffer);
    });
}

function downloadImage(url) {
    return request(url).promise()
        .then(function (response) {
            return response.body;
        })
        .catch(function () {
            throw new Error('Unable to download banner');
        })
}

var bannerProxy = {
    middleware: function (req, res) {
        var seriesid = req.params.seriesid;
        var type = req.params.type;
        if (TYPES[type] === undefined) {
            return res.status(400).end('Unknown banner type');
        }

        var cacheKey = seriesid + '_' + type;
        imageCache.get(cacheKey)
            .then(function (imagedata) {
                if (imagedata) {
                    sendImage(res, imagedata);
                } else {
                    tvdb.getBannerUrl(seriesid, type)
                        .then(downloadImage)
                        .then(function (imagedata) {
                            imageCache.put(cacheKey, imagedata);
                            sendImage(res, imagedata)
                        })
                        .catch(function (err) {
                            debug(err);
                            sendFallbackImage(res, type);
                        });
                }
            });
    }
};

module.exports = bannerProxy;