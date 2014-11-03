var Context = require('./utils/Context');
var AppRoutes = require('./AppRoutes.jsx');
var SearchStore = require('./stores/SearchStore.js');
var SeriesStore = require('./stores/SeriesStore.js');
var NotificationStore = require('./stores/NotificationStore');

Context.registerStore(SearchStore);
Context.registerStore(SeriesStore);
Context.registerStore(NotificationStore);

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
