const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const market = require('./market');

const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/market', (req, res) => {
  res.send(market.marketPositions);
});

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});





setInterval(function () {
  console.log('Emmit', market.marketPositions[0]);
  market.updateMarket();
  io.sockets.emit('message', market.marketPositions[0]);
}, 1000);

io.on('connection', function (socket) {
  console.log('a user connected');
});
