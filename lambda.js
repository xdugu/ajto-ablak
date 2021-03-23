const awsServerlessExpress = require('aws-serverless-express-edge')
const server = require('./dist/ajto-ablak/server/main');
const awsServerlessExpressMiddleware = require('aws-serverless-express-edge/middleware');
const app = server.app();
app.use(awsServerlessExpressMiddleware.eventContext());
const serverProxy = awsServerlessExpress.createServer(app);

module.exports.ssrserverless = (event, context, callback) => {
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));
    context.callbackWaitsForEmptyEventLoop = false;
    if(event.Records[0].cf.config.eventType === "origin-request"){         
        context.succeed = (response) => {
            console.log("Got response from context");
            callback(null, response);
        };      
        return awsServerlessExpress.proxy(serverProxy, event, context);
    }
    else{
        const response = event.Records[0].cf.response;
        return callback(null, response);
    }

}
