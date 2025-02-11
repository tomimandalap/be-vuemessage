const conn = require('../config/dbconfig')

module.exports = {
  modelCheckEmail: (email) => {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM tb_users WHERE email='${email}'`, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  modelRegister: (user) => {
    return new Promise((resolve, reject) => {
      conn.query(`INSERT INTO tb_users (room_id, name, email, password) 
      VALUES ('${user.room_id}','${user.name}','${user.email}','${user.password}')`, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  // total page
  modelTotalUser: (search) => {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT COUNT (*) as total FROM tb_users ${search}`
      ,(error, result) => {
        if(!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  modelAllUser: (search, sortby, pages) => {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM tb_users ${search} ${sortby} ${pages}`
      ,(error, result) => {
        if(!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  modelDetailUser: (id) => {
    return new Promise ((resolve, reject) => {
      conn.query(`SELECT * FROM tb_users WHERE id='${id}'`
      , (error, result) => {
        if(!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  modelPatchUser: (data, id) => {
    return new Promise ((resolve, reject) => {
      conn.query(`UPDATE tb_users SET ? WHERE id = ?`,[data, id], (error, result) => {
        if(!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  }
}