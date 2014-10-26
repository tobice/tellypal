var Promise = require('bluebird');
var _ = require('lodash');

/**
 * Fetcher wrapper nicely exposing server API to the client. Complementary to
 * function fetcherizeApi.
 *
 * @param {object} fetcher - Fetchr instance
 * @param {string} resource - Resource name which will be used for fetchr calls
 * @constructor
 */
function ClientApi(fetcher, resource) {
    this.fetcher = fetcher;
    this.resource = resource;
    this.config = {}; // TODO: is this even needed?
}

ClientApi.prototype.call = function () {
    var body = {
        method: arguments[0],
        params: _.rest(arguments)
    };
    var fetcher = this.fetcher;
    var resource = this.resource;
    var config = this.config;

    return new Promise(function (resolve, reject) {
        // We use 'create' function to enforce POST function.
        fetcher.create(resource, {}, body, config, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = ClientApi;