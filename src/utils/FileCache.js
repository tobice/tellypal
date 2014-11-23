var fs = require('fs');
var Promise = require('bluebird');

function FileCache(dir) {
    this.dir = dir;

    if (!fs.existsSync(dir)) {
        throw new Error('FileCache: the cache dir does not exist');
    }

    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        throw new Error('FileCache: the cache dir is not a directory');
    }
}

FileCache.prototype.exists = function (key) {
    var filename = this.dir + '/' + key;
    return new Promise(function (resolve) {
        fs.exists(filename, function (exists) {
            resolve(exists);
        });
    });
};

FileCache.prototype.get = function (key) {
    var filename = this.dir + '/' + key;
    return this.exists(key).then(function (exists) {
        if (!exists) {
            return null;
        }

        return new Promise(function (resolve, reject) {
            fs.readFile(filename, function (error, buffer) {
                if (error) {
                    return reject(error);
                }
                return resolve(buffer);
            })
        })
    })
};

FileCache.prototype.put = function (key, data) {
    var filename = this.dir + '/' + key;
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, data, function (error) {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
};

module.exports = FileCache;