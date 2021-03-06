"use strict";

var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var os = require("os");
var concatStream = require("concat-stream");
var browserify = require("browserify");

module.exports = function (options, cb) {
    var tmpDir = options.tmpDir || os.tmpDir();
    var destFilePath = path.resolve(tmpDir, "__global-wrap-temp" + Math.random() + ".js");
    var relativeModuleId = path.relative(tmpDir, options.main).replace(/\\/g, "/");
    var destContents = "self[\"" + options.global + "\"] = require(\"./" + relativeModuleId + "\");\n";

    fs.writeFile(destFilePath, destContents, function (err) {
        if (err) {
            return cb(err);
        }

        var browserifyOptions = _.extend({}, options.browserifyOptions, {
            entries: [destFilePath],
            standalone: false
        });

        var bundleStream = browserify(browserifyOptions).bundle();

        bundleStream.on("error", function (err) {
            cb(err);
        });

        bundleStream.pipe(concatStream({ encoding: "string" }, function (output) {
            fs.unlink(destFilePath, function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null, output);
            });
        }));
    });
};
