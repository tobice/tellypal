var Dispatcher = require('dispatchr')();
var _ = require('lodash');
var Api = require('./Api');

function Context(options) {
    options = options || {};
    this.dispatcher = new Dispatcher({});
    this.fetcher = options.fetcher || null;
    this.actionContext = this.getActionContext();
    this.componentContext = this.getComponentContext();
}

Context.registerStore = Dispatcher.registerStore.bind(Dispatcher);

Context.prototype.getComponentContext = function () {
    var self = this;
    return {
        executeAction: function (actionController, payload) {
            return actionController(self.actionContext, payload);
        },
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
        fetcher: self.fetcher,
        getApi: function (resource) {
            return new Api(self.fetcher, resource);
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
