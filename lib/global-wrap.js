"use strict";

var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var os = require("os");
var concatStream = require("concat-stream");
var browserify = require("browserify");

module.exports = function (options, cb) {
    var destFilePath = path.resolve(os.tmpDir(), "__global-wrap-temp" + Math.random() + ".js");
    var mainModuleName = path.basename(options.main, ".js");
    var relativeModuleId = path.relative(path.dirname(destFilePath), options.main).replace(/\\/g, "/");
    var destContents = "self[\"" + options.global + "\"] = require(\"" + relativeModuleId + "\");\n";

    fs.writeFile(destFilePath, destContents, function (err) {
        if (err) {
            return cb(err);
        }

        var bundleOptions = _.extend({}, options.bundleOptions, { standalone: false });

        var bundleStream = browserify([destFilePath]).bundle(bundleOptions);

        bundleStream.on("error", function (err) {
            cb(err);
        });

        bundleStream.pipe(concatStream(function (output) {
            fs.unlink(destFilePath, function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null, output);
            });
        }));
    });
};
