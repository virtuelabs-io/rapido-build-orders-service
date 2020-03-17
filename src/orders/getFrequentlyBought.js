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
    let query = `
        SELECT product_id AS product_id,
                SUM(frequency) AS frequency
        FROM (
            SELECT product_id,
                count(*) as frequency
                FROM orders.item
                GROUP BY product_id
            UNION
            SELECT product_id as product_id,
                count(*) as frequency
                FROM guests.item
                GROUP BY product_id
            ) AS frequency_summary
        GROUP BY product_id
        ORDER BY frequency DESC
        LIMIT 10;`
    console.log("Running query", query);
    let results = await mysql.query(query)
    await mysql.end()
    return results
}
