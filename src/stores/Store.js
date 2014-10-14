var util = require('util');
var BaseStore = require('dispatchr/utils/BaseStore');

function Store(dispatcher) {
    this.dispatcher = dispatcher;
    this.contents = null;
}

util.inherits(Store, BaseStore);

Store.prototype.getContents = function () {
    return this.contents;
};

Store.prototype.setContents = function (contents) {
    this.contents = contents;
    this.emitChange();
};

// TODO: update contents

Store.prototype.clear = function () {
    this.contents = null;
    this.emitChange();
};

Store.prototype.dehydrate = function () {
    return {
        contents: this.contents
    };
};

Store.prototype.rehydrate = function (state) {
    this.contents = state.contents;
};

module.exports = Store;
