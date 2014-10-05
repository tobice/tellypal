var Promise = require("bluebird");
var superagent = require("superagent");

/**
 * Adds promise support for superagent. Call .promise() to return promise for
 * the request.
 *
 * Based on https://github.com/KyleAMathews/superagent-bluebird-promise
 */
superagent.Request.prototype.promise = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.end(function (err, res) {
            if (err) reject(err);
            else resolve(res);
        });
    });
};
