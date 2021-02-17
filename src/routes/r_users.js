const express = require('express')
const Router = express.Router()

const { login, register, updateImage } = require('../controllers/c_users')

const singleUploadimg = require('../helpers/upload')

Router
  .post('/login', login)
  .post('/register', register)
  .patch('/profile/:id', singleUploadimg, updateImage)

module.exports = Router
