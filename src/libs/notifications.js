var db = require('../utils/db');
var debug = require('debug')('tellypal:notifications');

var notifications = {

    notify: function (title, message, type, duration) {
        debug('New notification added: ' + title);
        db.Notification.insert({
            title: title,
            message: message,
            type: type,
            duration: duration,
            shown: false
        });
    },

    onNewNotification: function (listener) {
        debug('New listener registered');
        db.Notification.addListener('insert', listener);
    },

    /**
     * Return all new notifications and mark them as shown
     *
     * @returns {Array.<Object>}
     */
    flushNew: function () {
        debug('Unread notifications flushed');
        var query = db.Notification.find({shown: false});
        query.update({shown: true});
        return query.toArray();
    }
};

module.exports = notifications;