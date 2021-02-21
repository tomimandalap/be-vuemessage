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

// const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log(`User connected`)

  socket.on('disconnect', () => {
    console.log('Disconnected')
  })

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
  })

  socket.on('get-list-users', (data) => {
    conn.query(`SELECT * FROM tb_users WHERE id !=${data.id}`, (err, result) => {
      io.to(data.room_id).emit('res-get-list-users', result)
    })
  })

  // send data friendship to db
  socket.on('get-friendship', (data) => {
    conn.query(`INSERT INTO tb_friend (from_id, to_id, status) VALUES 
    ('${data.from_id}','${data.to_id}','${data.status}')`, (err, result) => {
      io.to(data.room_id).emit('res-friendship', {message: 'success', data})
    })
  })

  // send db to list friendship
  socket.on('get-list-db', (data) => {
    conn.query(`SELECT * FROM tb_friend`, (err, result) => {
      io.to(data).emit('res-list-db', result)
    })
  })

  socket.on('get-list-chat', (user) => {
    conn.query(`SELECT tb_chat.date, tb_chat.from_id, tb_chat.to_id, tb_chat.message, user_from.name AS from_name, user_from.image AS from_image, user_from.room_id AS from_room_id, user_to.room_id AS to_room_id FROM tb_chat LEFT JOIN tb_users AS user_from ON tb_chat.from_id = user_from.id LEFT JOIN tb_users AS user_to on tb_chat.to_id = user_to.id
    WHERE (from_id='${user.from}' AND to_id='${user.to}') OR 
    (from_id='${user.to}' AND to_id='${user.from}')`, (error, result) => {
      io.to(user.room_id).emit('res-get-list-chat', result)
    })
  })

  socket.on('send-message', (data) => {
    conn.query(`INSERT INTO tb_chat 
    (from_id, to_id, message) VALUES 
    ('${data.from}','${data.to}','${data.msg}')`, (err, result) => {

      conn.query(`SELECT tb_chat.date, tb_chat.from_id, tb_chat.to_id, tb_chat.message, user_from.name AS from_name, user_from.image AS from_image, user_from.room_id AS from_room_id, user_to.room_id AS to_room_id FROM tb_chat LEFT JOIN tb_users AS user_from ON tb_chat.from_id = user_from.id LEFT JOIN tb_users AS user_to on tb_chat.to_id = user_to.id
      WHERE (from_id='${data.from}' AND to_id='${data.to}') OR 
      (from_id='${data.to}' AND to_id='${data.from}')`, (error, result) => {
        // console.log(result)
        io.to(result[0].from_room_id).emit('res-get-list-chat', result)
        io.to(result[0].to_room_id).emit('res-get-list-chat', result)
      })

    })
  })
  // broadcast
  socket.on('send-broadcast', (data) => {
    console.log(data)
    // socket.emit('res-broadcast', data.msg)
    // conn.query(`SELECT * FROM tb_users WHERE id !=${data.id}`, (err, result) => {
    //   // io.to(data.room_id).emit('res-get-list-users', result)
    //   console.log(result)
    // })
  })
})

server.listen(envPORT || 4000, cors(), () => {
  console.log(`server is running in http://localhost:${envPORT || 4000}`)
})