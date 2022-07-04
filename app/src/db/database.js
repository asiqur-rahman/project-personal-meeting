const config = require("../../../config.json");
const mysql2 = require('mysql2');

module.exports.query = async (sql, values) => {
    const db = mysql2.createPool({
        host: config.DB_CONFIG.HOST,
        user: config.DB_CONFIG.USER,
        password: config.DB_CONFIG.PASS,
        database: config.DB_CONFIG.DBNAME
    });
    return new Promise((resolve, reject) => {
        const callback = (error, result,fields) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        }
        // execute will internally call prepare and query
        db.execute(sql, values, callback);
    }).catch(err => {
        const mysqlErrorList = Object.keys(HttpStatusCodes);
        // convert mysql errors which in the mysqlErrorList list to http status code
        err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;

        throw err;
    });
}

// like ENUM
const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409
});
