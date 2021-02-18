const bcrypt = require('bcrypt')
const { modelRegister, modelCheckEmail, modelPatchUser, modelDetailUser, modelTotalUser, modelAllUser} = require('../models/m_users')
const jwt = require('jsonwebtoken')
const { envJWTSECRET } = require('../helpers/env')
const fs = require('fs')

module.exports = {
  login: async(req, res) => {
    const body = req.body
    modelCheckEmail(body.email).then(async(response) => {
      if (response.length === 1) {
        const checkPassword = await bcrypt.compare(body.password, response[0].password)
        if (checkPassword) {
          const dataUser = {
            id: response[0].id,
            email: response[0].email,
            room_id: response[0].room_id
          }
          // console.log(dataUser)
          const token = jwt.sign(dataUser, envJWTSECRET)
          const sendData = {
            id: response[0].id,
            room_id: response[0].room_id,
            name: response[0].name
          }
          // console.log(sendData)
          res.status(200).json({
            msg: 'Login success',
            data: sendData,
            token
          })
        } else {
          res.status(200).json({
            msg: 'Login failed, password wrong!'
          })
        }
      } else {
        res.status(200).json({
          msg: 'Email not found!'
        })
      }
    }).catch((err) => {
      res.status(500).json({
        msg: err.message
      })
    })
  },
  register: async(req, res) => {
    const body = req.body
    // check email
    modelCheckEmail(body.email).then(async(response) => {
      if (response.length >= 1) {
        res.status(200).json({
          msg: 'Email registered'
        })
      } else {
        const salt = await bcrypt.genSalt(10)
        const pass = await bcrypt.hash(body.password, salt)
        // console.log(pass)
        const user = {
          name: body.name,
          email: body.email,
          password: pass,
          room_id: `${Date.now()}`
        }
        modelRegister(user).then((response) => {
          res.status(200).json({
            msg: 'Register success!'
          })
        }).catch((err) => {
          res.status(500).json({
            msg: 'Internal server error!' || `${err.message}`
          })
        })
      }
    }).catch((err) => {
      res.status(500).json({
        msg: `${err.message}`
      })
    })
  },
  readAllUser: async(req, res) => {
    try {
      // searching name user
      const search = req.query.search ? req.query.search : 'name' 
      const keyword = req.query.keyword ? req.query.keyword : ``
      const searching = search ? `WHERE ${search.toString().toLowerCase()} LIKE '%${keyword.toString().toLowerCase()}%'` : ``

      // order && metode (ASC, DESC)
      const sort = req.query.sort ? req.query.sort : ``
      const metode = req.query.metode ? req.query.metode : 'asc'
      const sorting = sort ? `ORDER BY ${sort} ${metode.toString().toLowerCase()}` : ``

      // pagination
      const page = req.query.page ? req.query.page : 1
      const limit = req.query.limit ? req.query.limit : 4
      const start = page===1 ? 0 : (page-1)*limit
      const pages = page ? `LIMIT ${start}, ${limit}` : ``

      // total page tb user
      const totalPage = await modelTotalUser(searching)

      modelAllUser(searching, sorting, pages)
      .then((response) => {
        if(response.length > 0) {
          const pagination = {
            page: page,
            limit: limit,
            totalData: totalPage[0].total,
            totalPage: Math.ceil(totalPage[0].total/limit)
          }
          res.status(200).json({
            msg: 'Get all data user',
            pagenation: pagination,
            data: response
          })
        } else {
          res.status(200).json({
            msg: 'Oops, data not found!',
            data: []
          })
        }
      })
      .catch((error) => {
        res.status(500).json({
          msg: 'Internal server error!',
          data: error.message
        })
      })
    } catch (error) {
      // console.log(error.message)
      res.status(500).json({
        msg: 'Internal server error!',
        data: error.message
      })
    }
  },
  detailUser: (req, res) => {
    const id = req.params.id
    modelDetailUser(id)
    .then((response) => {
      if(response.length>0) {
        const data = {
          id: response[0].id,
          name: response[0].name,
          email: response[0].email,
          image: response[0].image
        }
        res.status(200).json({
          msg: 'Get detail user success',
          pagination: {},
          data: data
        })
      } else {
        res.status(200).json({
          msg: 'Oops, user not found!',
          data: []
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        msg: 'Internal server error!',
        data: []
      })
    })
  },
  updateImage: async(req, res) => {
    try {
      const id = req.params.id
      const data = req.body

      const newData = {
        name: data.name,
        image: req.file.filename,
        email: data.email
      }

      const callDetail = await modelDetailUser(id)
      // .then((response) => {
      //   if (response[0].image !== 'default.png') {
      //     fs.unlinkSync(`./public/image/${response[0].image}`)
      //   }
      // }).catch((err) => {
      //   console.log(err)
      // })

      if (newData.name === '' || newData.email === '') {
        const locationPath = `./public/img/${req.file.filename}`
        fs.unlinkSync(locationPath)
        res.status(400).json({ msg: 'All textfield is required!', data: [] })
      } else {
        modelPatchUser(newData, id)
        .then((response)=>{
          // console.log(callDetail[0].image)
          if (callDetail[0].image !== 'default.png') {
            const locationPath = `./public/img/${callDetail[0].image}`
            fs.unlinkSync(locationPath)
            res.status(200).json({
              msg: 'Update success!'
            })
          }
        })
        .catch((err) => {
          res.status(500).json({
            msg: 'Internal server error!'
          })
        })
      }
    } catch (err) {
      res.status(500).json({
        msg: 'Internal server error!'
      })
    }
  }
}
