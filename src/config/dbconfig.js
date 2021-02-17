const mysql = require('mysql2')

const {envDBHOST, envDBUSER, envDBPASS, envDB} = require('../helpers/env')

const conn = mysql.createConnection ({
  host: envDBHOST,
  user: envDBUSER,
  password: envDBPASS,
  database: envDB
})

module.exports = conn
