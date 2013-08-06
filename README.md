# Global-ify Your CommonJS Library

This library will bundle up your CommonJS code and expose it as a property of the `window` object. It does so using
[browserify](https://github.com/substack/node-browserify), so everything ends up in one file, even any native module
shims you depend on.

In essence, this is a lighter-weight alternative to browserify's built-in `standalone` option; it only generates the
global, omitting AMD support, and boils down the API into just what's necessary to complete this one task.

## Usage

This package's main module's default export is a function that takes two arguments: some options, and a callback.

The options are:

- `main`: the file path of your main module, which you want to expose as a global.
- `global`: the name of the global you want to expose.
- `bundleOptions`: any browserify [bundle options](https://github.com/substack/node-browserify#bbundleopts-cb) you want
  to pass along, like `debug` or `detectGlobals`.

The callback will be called with either an error or a string containing JavaScript source. This JS source will, upon
being loaded into a browser, create the specified global on `window`, whose value will be the same as if you'd done
`require(options.main)`. Thus, it's ready for inserting into your page as a `<script>` tag and use by other
global-using scripts.

Here's an example:

```js
var globalWrap = require("global-wrap");

globalWrap({
    main: "my-library.js",
    global: "myLib",
    bundleOptions: { detectGlobals: false }
}, function (err, output) {
    // handle `err`, or write `output` to a `.js` file, or something.
});
```
