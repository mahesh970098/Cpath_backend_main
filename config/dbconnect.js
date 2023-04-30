const mysql = require('mysql');

USER = 'root'
// PWD = 'URwelcome@123#'
PWD = 'root'
DATABASE = "charispathway"
// DATABASE = "newapp"
// DB_HOST_NAME = "65.1.193.223"
DB_HOST_NAME = 'localhost'



const MySQLConPool = mysql.createPool({

    user: USER,
    password: PWD,
    database: DATABASE,
    host: DB_HOST_NAME,
    port: "3306",
    connectTimeout: 20000,
    connectionLimit: process.env.MAX_POOL_SIZE,
    debug: false,
    timezone: 'utc',
    multipleStatements: true,
    insecureAuth: true
});

exports.MySQLConPool = MySQLConPool;



