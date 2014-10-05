module.exports = {
    name: 'tvshows',

    read: function (req, resource, params, config, callback) {
        if (params && params.error) {
            return callback(new Error('Hey there has been an error thrown'));
        }
        callback(null, {
            message: 'Hey, this is TellyPal'
        });
    }
};