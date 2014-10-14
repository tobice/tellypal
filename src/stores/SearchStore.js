var util = require('util');
var Store = require('./Store');

function SearchStore(dispatcher) {
    SearchStore.super_(dispatcher);
    this.contents = {
        results: []
    }
}

SearchStore.storeName = 'SearchStore';
SearchStore.handlers = {
    'SEARCH': 'setContents',
    'SEARCH_UPDATE': 'updateContents'
};

util.inherits(SearchStore, Store);

module.exports = SearchStore;
