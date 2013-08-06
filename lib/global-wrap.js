"use strict";

var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var concatStream = require("concat-stream");
var browserify = require("browserify");

module.exports = function (options, cb) {
    var destFilePath = path.resolve(path.dirname(options.main), "__global-wrap-temp.js");
    var mainModuleName = path.basename(options.main, ".js");
    var destContents = "window[\"" + options.global + "\"] = require(\"./" + mainModuleName + "\");\n";

    fs.writeFile(destFilePath, destContents, function (err) {
        if (err) {
            return cb(err);
        }

        var bundleOptions = _.extend({}, options.bundleOptions, { standalone: false });

        var bundleStream = browserify([destFilePath]).bundle(bundleOptions);

        bundleStream.on("error", function () {
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
