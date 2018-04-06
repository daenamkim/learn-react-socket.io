const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 4001

http.listen(port, () => {
  console.log('listening on *: ' + port)
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (client) => {
  console.log('New client connection: ' + client.id)

  client.on('disconnect', () => {
    console.log('Client disconnected')
  })

  client.on('changeColor', color => {
    console.log('Color Changed to: ', color)
    io.emit('newColor', color)
  })

  client.on('sendMessage', (msg) => {
    console.log('message: ' + msg)
    io.emit('newMessage', msg)
    // client.emit('new message', msg)
  })

  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  })
})
