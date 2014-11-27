var warehouse = require('warehouse');
var Schema = warehouse.Schema;

var notification = new Schema({
    title: String,
    message: String,
    type: String,
    duration: Number,
    shown: Boolean
});

module.exports = notification;