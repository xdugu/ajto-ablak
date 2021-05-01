module.exports = {
    globDirectory: "dist/ajto-ablak/browser",
    globPatterns: ["**/*.{html,jss}"],
    globFollow: true,
    globStrict: true,
    globIgnores: ['**/*-es5.*.js', '3rdpartylicenses.txt', 'assets/images/icons/icon-*.png'],
    dontCacheBustURLsMatching: new RegExp('.+.[a-f0-9]{20}..+'),
    maximumFileSizeToCacheInBytes: 5000000,
    swSrc: "dist/ajto-ablak/browser/service-worker.js",
    swDest: "dist/ajto-ablak/browser/service-worker.js"
  };