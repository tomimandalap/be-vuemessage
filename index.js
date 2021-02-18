const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoute = require('./src/routes/r_users')

const { envPORT } = require('./src/helpers/env')

// db mysql
const conn = require('./src/config/dbconfig')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// app.use('/', (req, res) => {
//   res.send('<h1>HALO</h1>')
// })

app.use(userRoute)

// Set for check file
app.use('/image', express.static('./public/img'))

const server = http.createServer(app)

const io = socketio(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  console.log('user connected')

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
  })

  socket.on('get-list-users', (data) => {
    conn.query(`SELECT * FROM tb_users WHERE id !=${data.id}`, (err, result) => {
      io.to(data.room_id).emit('res-get-list-users', result)
    })
  })

  socket.on('get-list-chat', (user) => {
    conn.query(`SELECT * FROM tb_chat WHERE (from_id='${user.from}' AND to_id='${user.to}')
    OR (from_id='${user.to}' AND to_id='${user.from}')`, (error, result) => {
      io.to(user.room_id).emit('res-get-list-chat', result)
    })
  })

  socket.on('send-message', (data) => {
    conn.query(`INSERT INTO tb_chat 
    (from_id, to_id, message) VALUES 
    ('${data.from}','${data.to}','${data.msg}')`, (err, result) => {

      conn.query(`SELECT * FROM tb_chat WHERE (from_id='${data.from}' AND to_id='${data.to}')
      OR (from_id='${data.to}' AND to_id='${data.from}')`, (error, result) => {
        io.to(data.from).emit('res-get-list-chat', result)
        io.to(data.to).emit('res-get-list-chat', result)
      })

    })
  })
})

server.listen(envPORT || 4000, cors(), () => {
  console.log(`server is running in http://localhost:${envPORT || 4000}`)
})