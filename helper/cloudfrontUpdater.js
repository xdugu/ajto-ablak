// Script gets the lastest version of angular ssr code and applies it to a select list of 
// cloudfront lambda edge distibutions
const AWS = require('aws-sdk');
var lambda = new AWS.Lambda({region: 'us-east-1'});

var cloudfront = new AWS.CloudFront();

dists = ['EXBCB4YMVSX0M', 'E33WHZF3DSSW8E']
async function updateDistributions(distributions){

    // get live alias to get latest version
    const alias = await lambda.getAlias({
        FunctionName:'angular-ssr-zip-AngularSSR-N6B29SDowygS',
        Name: 'live'
    }).promise();

    for(const dist of distributions){
        //get current cloudfront config
        const config =  await cloudfront.getDistributionConfig({Id: dist}).promise();

        // modify config
        config.Id = dist;
        config.IfMatch = config.ETag;
        delete config.ETag;
        config.DistributionConfig.DefaultCacheBehavior
                .LambdaFunctionAssociations.Items[0].LambdaFunctionARN = 
                    alias.AliasArn.replace(':live', `:${alias.FunctionVersion}`);
        
        try{

            // update config
            await cloudfront.updateDistribution(config).promise();
            console.log("Successfully updated " + dist);

            // create invalidation
            await cloudfront.createInvalidation({
                DistributionId: dist,
                InvalidationBatch: {
                    CallerReference: Date.now().toString(),
                    Paths: {
                        Quantity: 1,
                        Items: ['/*']
                    }
                }
            }).promise();
            console.log("Finished invalidation " + dist);
        }
        catch(err){
            console.log(err);
            console.log("Update failed " + dist);
            return -1;
        }
    }

    return 1;
}

updateDistributions(dists).then(res => console.log(res));

