'use strict';

var AWS = require('aws-sdk');

module.exports.fun = async (event, context, callback) => {
    AWS.config.update({region: process.env.REGION});
    // Create an SQS service object
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

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
        QueueUrl: "https://sqs.eu-west-2.amazonaws.com/007938441437/dev-order-confirmation-queue"
    };

    const response = await sqs.sendMessage(params).promise();
    if(response) {
        console.log("Message queued to SQS successfully: ", response);
    } else {
        console.log("Message queued failed");
    }

    return {}
}
