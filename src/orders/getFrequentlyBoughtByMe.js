// internal function
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
    let customer_id = event.customer_id
    let query = `
        SELECT product_id,
               count(*) as frequency
        FROM orders.item
        WHERE customer_id = UUID_TO_BIN(?)
        GROUP BY product_id
        ORDER BY frequency DESC
        LIMIT 10;`
    console.log("Running query", query);
    let results = await mysql.query(query, [ customer_id ])
    await mysql.end()
    return results
}
