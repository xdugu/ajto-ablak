module.exports = {
      globDirectory: `dist/ajto-ablak/browser/hu/`,
      globPatterns: ["**/*.{css,eot,js,jsonttf,txt,xml}"],
      globFollow: true,
      globStrict: true,
      globIgnores: ['**/*-es5.*.js', '3rdpartylicenses.txt', 'assets/images/icons/icon-*.png'],
      dontCacheBustURLsMatching: new RegExp('.+.[a-f0-9]{20}..+'),
      maximumFileSizeToCacheInBytes: 5000000,
      swSrc: "webpack-config/service-worker.js",
      swDest: `dist/ajto-ablak/browser/hu/service-worker.js`
}