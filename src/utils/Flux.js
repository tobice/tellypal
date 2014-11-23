var Dispatcher = require('dispatchr')();
var _ = require('lodash');
var ClientApi = require('./ClientApi');
var notificationActions = require('../actions/notificationActions');

function Flux(options) {
    options = options || {};
    this.dispatcher = new Dispatcher({});
    this.fetcher = options.fetcher || null;
    this.actionFlux = this.getActionFlux();
    this.componentFlux = this.getComponentFlux();
}

Flux.registerStore = Dispatcher.registerStore.bind(Dispatcher);

/**
 * Send general notification.
 * @param {string} title
 * @param {string} message
 * @param {string} type - NotificationStore.(DANGER|WARNING|INFO|SUCCESS)
 * @param {number} duration - Notification duration in miliseconds (default 5000)
 */
Flux.prototype.notify = function (title, message, type, duration) {
    this.executeAction(notificationActions.add, {
        title: title,
        message: message,
        type: type,
        duration: duration
    });
};

Flux.prototype.executeAction = function (actionController, payload) {
    return actionController(this.actionFlux, payload);
};

Flux.prototype.getApi = function (resource) {
    return new ClientApi(this.fetcher, resource);
};

Flux.prototype.getComponentFlux = function () {
    var self = this;
    return {
        executeAction: self.executeAction.bind(this),
        notify: self.notify.bind(this),
        getStore: self.dispatcher.getStore.bind(self.dispatcher)
    }
};

Flux.prototype.getActionFlux = function () {
    var self = this;
    return {
        executeAction: self.executeAction.bind(this),
        notify: self.notify.bind(this),
        getStore: self.dispatcher.getStore.bind(self.dispatcher),

        dispatch: self.dispatcher.dispatch.bind(self.dispatcher),
        fetcher: self.fetcher,
        getApi: self.getApi.bind(this)
    }
};

Flux.prototype.dehydrate = function () {
    return {
        dispatcher: this.dispatcher.dehydrate()
    };
};

Flux.prototype.rehydrate = function (obj) {
    this.dispatcher.rehydrate(obj.dispatcher || {});
};

module.exports = Flux;
