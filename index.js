const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoute = require('./src/routes/r_users')

const { envPORT } = require('./src/helpers/env')

const {users, chat} = require('./data')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// app.use('/', (req, res) => {
//   res.send('<h1>HALO</h1>')
// })

app.use(userRoute)

const server = http.createServer(app)

const io = socketio(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  console.log('user connected')
  // socket.on('test', (payload) => {
  //   console.log(payload)
  // })
  socket.on('pesan', (payload) => {
    // console.log(payload)
    io.emit('data', payload)
  })
  socket.on('get-list-users', () => {
    io.emit('res-get-list-users', users)
  })
  socket.on('get-list-chat', () => {
    io.emit('res-get-list-chat', chat)
  })
})

server.listen(envPORT || 4000, cors(), () => {
  console.log(`server is running in http://localhost:${envPORT || 4000}`)
})