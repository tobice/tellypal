var util = require('util');
var _ = require('lodash');
var BaseStore = require('dispatchr/utils/BaseStore');

function NotificationStore(dispatcher) {
    this.dispatcher = dispatcher;
    this._counter = 0;
    this._notifications = [];
}

NotificationStore.SUCCESS = 'success';
NotificationStore.INFO = 'info';
NotificationStore.DANGER = 'danger';
NotificationStore.WARNING = 'warning';

NotificationStore.NEW = 'new';
NotificationStore.SHOWING = 'showing';
NotificationStore.DISMISSED = 'dismissed';

NotificationStore.storeName = 'NotificationStore';
NotificationStore.handlers = {
    'NOTIFICATION_ADD': 'add',
    'NOTIFICATION_SET_STATUS': 'setStatus'
};

util.inherits(NotificationStore, BaseStore);

NotificationStore.prototype.add = function (payload) {
    this._notifications.push({
        id: ++this._counter,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        status: NotificationStore.NEW,
        duration: payload.duration || 5000
    });
    this.emitChange();
};

NotificationStore.prototype.setStatus = function (payload) {
    _.each(payload.notifications, function(id) {
        var notification = _.find(this._notifications, {id: id});
        notification.status = payload.status;
    }.bind(this));
    this.emitChange();
};

NotificationStore.prototype.getNotifications = function () {
    return _.filter(this._notifications, function (notification) {
       return notification.status != NotificationStore.DISMISSED;
    });
};

module.exports = NotificationStore;