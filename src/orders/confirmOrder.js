'use strict';

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

const mysql = require('serverless-mysql')({
    config: {
        host: process.env.HOST,
        user: process.env.USERNAME,
        port: process.env.PORT,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
})

module.exports.fun = async (event, context, callback) => {
    global.fetch = require('node-fetch');
    console.log(event)
    // Set the region
    AWS.config.update({region: process.env.REGION});
    // Create an SQS service object
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

    let customer_id = event.cognitoPoolClaims.sub
    let data = event.body
    let order_id = Number(event.path.id)
    let query = `
        CALL orders.confirm_order(UUID_TO_BIN(?),?,?);
    `;
    console.log("Running query", query);
    let results = await mysql.query(query, [ customer_id, order_id, data.charge_id ])
    results._metadata = {
        "receiptEmail": data.receiptEmail,
        "guest": false
    }
    await mysql.end()
    var params = {
        DelaySeconds: 5,
        MessageAttributes: {
            "Author": {
                DataType: "String",
                StringValue: data.description
            },
            "WeeksOn": {
                DataType: "Number",
                StringValue: "7"
            }
        },
        MessageBody: JSON.stringify(results),
        QueueUrl: process.env.SQS_QUEUE_URL
    };
    console.log("Firing message to: ", process.env.SQS_QUEUE_URL);
    const response = await sqs.sendMessage(params).promise();
    if(response) {
        console.log("Message queued to SQS successfully: ", response);
    } else {
        console.log("Message queued failed");
    }
    return results
}
