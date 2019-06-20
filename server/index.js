const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const miners = require('./miners');

const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/miners', (req, res) => {
  res.send(miners.getMiners());
});

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});

setInterval(function () {
  miners.updateValues()
  const data = miners.getLatest();
  io.sockets.emit('message', data);
  // if(miners.validateMinerOneLength()) {
  //   throw new Error('Forced Error');
  // }
}, 500);

io.on('connection', function (socket) {
  console.log(`A user connected: ${socket.id}`);
});
