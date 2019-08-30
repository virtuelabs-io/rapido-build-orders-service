'use strict';

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
    let data = event.body
    let query = `
        SELECT id,
               cost,
               description
        FROM orders.delivery_cost;
    `;
    console.log("Running query", query);
    let results = await mysql.query(query)
    await mysql.end()
    return results
}
