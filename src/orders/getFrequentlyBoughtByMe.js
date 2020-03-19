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
        SELECT i.product_id as product_id,
               count(i.product_id) as frequency
        FROM orders.header h
        INNER JOIN orders.item i
            ON h.id = i.order_id
            AND h.customer_id = UUID_TO_BIN(?)
        GROUP BY i.product_id
        ORDER BY frequency DESC
        LIMIT 10;`
    console.log("Running query", query);
    let results = await mysql.query(query, [ customer_id ])
    await mysql.end()
    return results
}
