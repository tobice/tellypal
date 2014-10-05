var Fetcher = require('fetchr');
var Api = require('./src/lib/Api');

Fetcher.registerFetcher(require('./src/api/fetchr'))

var fetcher = new Fetcher({});
var api = new Api(fetcher, 'tvshows');

api.read({ error: false })
    .then(console.log)
    .catch(console.error);