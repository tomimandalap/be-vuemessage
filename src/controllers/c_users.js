const bcrypt = require('bcrypt')
const { modelRegister, modelCheckEmail, modelPatchUser, modelDetailUser } = require('../models/m_users')
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
  updateImage: async(req, res) => {
    try {
      const id = req.params.id
      const callDetail = await modelDetailUser(id)
      const data = req.body

      const newData = {
        name: data.name,
        image: req.file.filename,
        email: data.email
      }

      if (newData.name === '' || newData.email === '') {
        const locationPath = `./public/img/${req.file.filename}`
        fs.unlinkSync(locationPath)
        res.status(400).json({ msg: 'All textfield is required!', data: [] })
      } else {
        modelPatchUser(newData, id)
        .then((response)=>{
          const locationPath = `./public/img/${callDetail[0].image}`
          fs.unlinkSync(locationPath)
          res.status(200).json({
            msg: 'Update success!'
          })
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
