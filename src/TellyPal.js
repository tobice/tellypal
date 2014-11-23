var Flux = require('./utils/Flux');
var SearchStore = require('./stores/SearchStore.js');
var SeriesStore = require('./stores/SeriesStore.js');
var NotificationStore = require('./stores/NotificationStore');
var TorrentUIStore = require('./stores/TorrentUIStore');

Flux.registerStore(SearchStore);
Flux.registerStore(SeriesStore);
Flux.registerStore(NotificationStore);
Flux.registerStore(TorrentUIStore);

function TellyPal(options) {
    options = options || {};
    var fetcher = options.fetcher;
    var initialState = options.initialState;

    this.flux = new Flux({
        fetcher: fetcher
    });

    if (initialState) {
        this.flux.rehydrate(initialState);
    }
}

TellyPal.prototype.getComponentFlux = function () {
    return this.flux.getComponentFlux();
};

module.exports = TellyPal;
module.exports.config = {
    xhrPath: '/api'
};
