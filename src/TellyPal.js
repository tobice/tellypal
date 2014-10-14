var Context = require('./lib/Context');
var AppRoutes = require('./AppRoutes.jsx');
var SearchStore = require('./stores/SearchStore.js');

Context.registerStore(SearchStore);

function TellyPal(options) {
    options = options || {};
    var fetcher = options.fetcher;
    var initialState = options.initialState;

    this.context = new Context({
        fetcher: fetcher
    });

    if (initialState) {
        this.context.rehydrate(initialState);
    }
}

TellyPal.prototype.getRoutes = function () {
    return AppRoutes.get(this.context.getComponentContext());
};

module.exports = TellyPal;
module.exports.config = {
    xhrPath: '/api'
};
