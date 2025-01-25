const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');

const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');

const app = express();      
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', userRoutes);
app.use('/game', gameRoutes);

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

module.exports = {io};