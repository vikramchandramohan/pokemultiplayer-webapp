const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let latestData = {};

//routing path
app.get('/', (req, res) => {
    res.render('index', { appName: 'My App' });
});

app.post('/endpoint', (req, res) => {
    latestData = req.body;
    // Emit update to all connected clients
    io.emit('dataUpdate', latestData);
    res.json({ success: true });
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send current data when client connects
    socket.emit('dataUpdate', latestData);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start the App
server.listen(5000, () => {
    console.log('App started on port 5000');
});