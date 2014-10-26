var _ = require('lodash');

/**
 * Create fetchr object that will transparently translate POST requests into
 * calls to provided Api class. For each request, a new instance of Api class
 * is created.
 *
 * @param {function(new:Object,Object,Object)} Api - Constructor function of API class
 * @returns {Object} - Fetchr object
 */
function fetcherizeApi (Api) {
    return {
        // Function name is used as the fetchr name
        name: Api.name,

        create: function (req, resource, params, body, config, callback) {
            if (!body.method || !_.isString(body.method)) {
                return callback(new Error('Provide method name in the request body as a string'));
            }
            if (body.params && !_.isArray(body.params)) {
                return callback(new Error('Provide method parameters as an array'));
            }

            // Create new instance of API with current request and config
            // (that will allow us to perform authentication for example)
            var api = new Api (req, config);
            var handler = api[body.method];

            if (!_.isFunction(handler)) {
                return callback(new Error('Provided method ' + body.method + ' does not exist or is not callable'));
            }

            handler.apply(api, body.params)
                .then(function (result) {
                    callback(null, result);
                })
                .catch(callback);
        }
    };

}

module.exports = fetcherizeApi;

