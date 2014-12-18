var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var exec = require('child_process').exec;

var pyjade = function(options) {
    if(options === undefined) {
        options = {};
    }
    return through.obj(function(file, enc, callback) {
        var stream = this;
        if(file.isNull()) {
            stream.push(file);
            callback();
            return;
        }
        if(file.isStream()) {
            stream.emit('error', new gutil.PluginError('gulp-pyjade', 'Streams are not supported'));
            callback();
            return;
        }
        var command = exec('pyjade -c ' + (options.engine || 'django'), function(error, stdout, stderr) {
            if(error) {
                stream.emit('error', new gutil.PluginError('gulp-pyjade', error));
                callback();
                return;
            }
            file.contents = new Buffer(stdout);
            file.path = gutil.replaceExtension(file.path, '.html');
            stream.push(file);
            callback();
        });
        command.stdin.write(file.contents);
        command.stdin.end();
    });
}

module.exports = pyjade;