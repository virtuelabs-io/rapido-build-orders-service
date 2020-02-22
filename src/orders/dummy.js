'use strict';

var AWS = require('aws-sdk');

module.exports.fun = async (event, context, callback) => {
    AWS.config.update({region: process.env.REGION});
    // Create an SQS service object
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    console.log("Firing message to: ", process.env.SQS_QUEUE_URL);
    var params = {
        DelaySeconds: 5,
        MessageAttributes: {
            "Author": {
                DataType: "String",
                StringValue: "sample"
            },
            "WeeksOn": {
                DataType: "Number",
                StringValue: "7"
            }
        },
        MessageBody: "Some message",
        QueueUrl: process.env.SQS_QUEUE_URL
    };

    const response = await sqs.sendMessage(params).promise();
    if(response) {
        console.log("Message queued to SQS successfully: ", response);
    } else {
        console.log("Message queued failed");
    }

    return {}
}
