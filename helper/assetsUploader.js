// This file used the pre-installed aws cli to upload data from the 'dist/browser' folder
// to an s3 bucket which can be later served from a cloudfront distribution

const { exec } = require('child_process');
const path = require('path');

bucket = "s3://adugu-testing/webAssets"
const distPath = path.resolve('dist/ajto-ablak/browser');
exec(`aws s3 sync "${distPath}" ${bucket} --acl="public-read"`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });