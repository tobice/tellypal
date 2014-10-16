var Promise = require('bluebird');
var _ = require('lodash');

/**
 * Promise wrapper around fetchr.
 *
 * @param {object} fetcher - Fetchr instance
 * @param {string} resource - Resource name which will be used for fetchr calls
 * @constructor
 */
function Api(fetcher, resource) {
    this.fetcher = fetcher;
    this.resource = resource;
}

_.each(['read', 'create', 'update', 'delete'], function (method) {
    Api.prototype[method] = function (params, config) {
        var fetcher = this.fetcher;
        var resource = this.resource;
        return new Promise(function (resolve, reject) {
            fetcher[method](resource, params, config, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    };
});

module.exports = Api;