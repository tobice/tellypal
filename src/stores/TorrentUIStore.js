var util = require('util');
var BaseStore = require('dispatchr/utils/BaseStore');

var MAX_HISTORY_LENGTH = 20;

function TorrentUIStore(dispatcher) {
    this.dispatcher = dispatcher;
    this._stateHistory = [];

    // Increase max number of allowed listeners for EventEmitter. It is highly
    // probable that many components will listen to this store (for example
    // EpisodeDownload component for each episode in a season)
    this.setMaxListeners(30);
}

TorrentUIStore.storeName = 'TorrentUIStore';
TorrentUIStore.handlers = {
    'TORRENTUI_UPDATE_STATE': 'updateState'
};

util.inherits(TorrentUIStore, BaseStore);

TorrentUIStore.prototype.updateState = function (uiState) {
    this._stateHistory.push(uiState);
    if (this._stateHistory.length > MAX_HISTORY_LENGTH) {
        this._stateHistory.shift();
    }
    this.emitChange()
};

TorrentUIStore.prototype.getCurrentState = function () {
    if (this._stateHistory.length == 0) {
        return null;
    }
    return this._stateHistory[this._stateHistory.length - 1];
};

TorrentUIStore.prototype.getTorrent = function (hash) {
    var state = this.getCurrentState();
    if (!state) {
        return null;
    }
    return state.torrents[hash];
};

TorrentUIStore.prototype.findTorrent = function (keywords) {
    var regex = new RegExp(keywords.replace(/ /gi, '.+'));
    var torrents = this.getCurrentState().torrents;
    for (var hash in torrents) {
        if (torrents.hasOwnProperty(hash)) {
            if (regex.test(torrents[hash].name)) {
                return torrents[hash];
            }
        }
    }
};

module.exports = TorrentUIStore;

