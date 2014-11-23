var Context = require('./utils/Context');
var SearchStore = require('./stores/SearchStore.js');
var SeriesStore = require('./stores/SeriesStore.js');
var NotificationStore = require('./stores/NotificationStore');
var TorrentUIStore = require('./stores/TorrentUIStore');

Context.registerStore(SearchStore);
Context.registerStore(SeriesStore);
Context.registerStore(NotificationStore);
Context.registerStore(TorrentUIStore);

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

TellyPal.prototype.getComponentContext = function () {
    return this.context.getComponentContext();
};

module.exports = TellyPal;
module.exports.config = {
    xhrPath: '/api'
};
