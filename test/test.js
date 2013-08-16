"use strict";

var path = require("path");
var assert = require("assert");
var jsdom = require("jsdom");
var globalWrap = require("..");

specify("It works", function (done) {
    globalWrap({
        main: path.resolve(__dirname, "input/main.js"),
        global: "theTestGlobal",
        bundleOptions: { detectGlobals: false }
    }, function (err, output) {
        assert.ifError(err);

        jsdom.env({
            html: "<!DOCTYPE html><html><head><title>Global Wrap Test</title></head><body></body></html>",
            src: [output, "window.theTestGlobal();"],
            done: function (err, window) {
                assert.ifError(err);
                assert.strictEqual(window.testData, "beep boop; typeof process is: undefined");
                done();
            }
        });
    });
});
