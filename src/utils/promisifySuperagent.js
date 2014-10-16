var Promise = require("bluebird");
var superagent = require("superagent");
var util = require('util');

function SuperagentError(res) {
    this.response = res;
    this.message = res.error.toString();
}

SuperagentError.prototype.toString = function () {
    return this.message;
};

SuperagentError.prototype = new Error();

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
            if (err) {
                reject(err);
            } else if (res.error) {
                reject(new SuperagentError(res));
            } else resolve(res);
        });
    });
};
