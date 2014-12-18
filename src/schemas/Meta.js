var warehouse = require('warehouse');
var Schema = warehouse.Schema;

var meta = new Schema({
    lastLibraryUpdate: String
});

module.exports = meta;