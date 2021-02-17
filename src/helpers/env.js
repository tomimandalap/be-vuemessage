require('dotenv').config()

module.exports = {
  envPORT: process.env.PORT,
  envDBHOST: process.env.DBHOST,
  envDBUSER: process.env.DBUSER,
  envDBPASS: process.env.DBPASS,
  envDB    : process.env.DB,
  envJWTSECRET : process.env.JWTSECRET
}