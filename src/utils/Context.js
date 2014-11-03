var Dispatcher = require('dispatchr')();
var _ = require('lodash');
var ClientApi = require('./ClientApi');
var notificationActions = require('../actions/notificationActions');

function Context(options) {
    options = options || {};
    this.dispatcher = new Dispatcher({});
    this.fetcher = options.fetcher || null;
    this.actionContext = this.getActionContext();
    this.componentContext = this.getComponentContext();
}

Context.registerStore = Dispatcher.registerStore.bind(Dispatcher);

/**
 * Send general notification.
 * @param {string} title
 * @param {string} message
 * @param {string} type - NotificationStore.(DANGER|WARNING|INFO|SUCCESS)
 * @param {number} duration - Notification duration in miliseconds (default 5000)
 */
Context.prototype.notify = function (title, message, type, duration) {
    this.actionContext.executeAction(notificationActions.add, {
        title: title,
        message: message,
        type: type,
        duration: duration
    });
};

Context.prototype.getComponentContext = function () {
    var self = this;
    return {
        executeAction: function (actionController, payload) {
            return actionController(self.actionContext, payload);
        },
        notify: self.notify.bind(this),
        getStore: self.dispatcher.getStore.bind(self.dispatcher)
    }
};

Context.prototype.getActionContext = function () {
    var self = this;
    return {
        dispatch: self.dispatcher.dispatch.bind(self.dispatcher),
        executeAction: function (actionController, payload) {
            return actionController(self.actionContext, payload);
        },
        notify: self.notify.bind(this),
        fetcher: self.fetcher,
        getApi: function (resource) {
            return new ClientApi(self.fetcher, resource);
        },
        getStore: self.dispatcher.getStore.bind(self.dispatcher)
    }
};

Context.prototype.dehydrate = function () {
    return {
        dispatcher: this.dispatcher.dehydrate()
    };
};

Context.prototype.rehydrate = function (obj) {
    this.dispatcher.rehydrate(obj.dispatcher || {});
};

module.exports = Context;
