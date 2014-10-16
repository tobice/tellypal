var _ = require('lodash');
var xml2js = require('xml2js');
var Promise = require('bluebird');
Promise.promisifyAll(xml2js);

xmlHelpers = {

    /**
     * Parse XML superagent response into JSON
     * @param {object} response - superagent's response
     * @returns {Promise}
     */
    parseXMLResponse: function (response) {
        return xml2js.parseStringAsync(response.text);
    },

    /**
     * Cleans up object generated from XML by xml2js. Basically converts each
     * property value from ['value'] into 'value'.
     *
     * @param {object} object - Key-value object to be cleaned
     * @returns {object}
     */
    cleanObject: function (object) {
        return _.mapValues(object, function (value) {
            return value[0];
        })
    },

    /**
     * Same as cleanObject, except it now expects an array of objects to be
     * cleaned.
     *
     * @param {Array} array - List of objects to be cleaned.
     * @returns {Array}
     */
    cleanObjects: function (array) {
        var cleaned = [];

        _.each(array, function (object) {
            cleaned.push(xmlHelpers.cleanObject(object));
        });

        return cleaned;
    }
};

module.exports = xmlHelpers;