"use strict";

var path = require("path");
var fs = require("fs");
var assert = require("assert");
var globalWrap = require("..");

// Why am I using Mocha for this, you ask? Because of the great string diffing, I answer.

specify("It works", function (done) {
    globalWrap({
        main: path.resolve(__dirname, "input/main.js"),
        global: "theTestGlobal",
        bundleOptions: { detectGlobals: false }
    }, function (err, output) {
        assert.ifError(err);

        var expected = fs.readFileSync(path.resolve(__dirname, "expected/expected.js"), "utf-8");
        assert.strictEqual(output, expected);
        done();
    });
});
