var _ = require('lodash');

/**
 * Converts data fetcher returning promises into standard callback based data
 * fetcher. All CRUD methods (read, create, update, delete) are "unpromisified".
 * @param {Object} fetcher
 * @returns {Object}
 */
var unpromisifyFetcher = function (fetcher) {

    // Loop through fetcher methods and wrap them by unpromisifying functions.
    _.each(_.functions(fetcher), function (fnProperty) {
        var orig = fetcher[fnProperty];
        fetcher[fnProperty] = function (req, resource, params, config, callback) {
            orig(req, resource, params, config)
                .then(function (result) {
                    callback(null, result);
                })
                .catch(callback);
        };
    });

    return fetcher;
};

module.exports = unpromisifyFetcher;

