const awsServerlessExpress = require('aws-serverless-express-edge')
const server = require('./dist/ajto-ablak/server/main');
const awsServerlessExpressMiddleware = require('aws-serverless-express-edge/middleware');

const app = server.app();
app.use(awsServerlessExpressMiddleware.eventContext());

const serverProxy = awsServerlessExpress.createServer(app);
module.exports.ssrserverless = (event, context) => {
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));
    awsServerlessExpress.proxy(serverProxy, event, context);
}
