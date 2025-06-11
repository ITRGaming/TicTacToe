const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');

const app = express();      
const server = http.createServer(app);
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ORIGIN.split(',');
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req,res) =>{
    res.send('<h1>Welcome to the backend</h1>')
})

app.use('/users', userRoutes);
app.use('/game', gameRoutes);

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
