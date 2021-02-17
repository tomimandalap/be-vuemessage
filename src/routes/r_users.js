const express = require('express')
const Router = express.Router()

const { login, register, updateImage, readAllUser, detailUser } = require('../controllers/c_users')

const singleUploadimg = require('../helpers/upload')

Router
  .get('/user', readAllUser)
  .get('/user/:id', detailUser)
  .post('/login', login)
  .post('/register', register)
  .patch('/profile/:id', singleUploadimg, updateImage)

module.exports = Router
