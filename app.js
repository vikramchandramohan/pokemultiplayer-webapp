const express = require('express');
const ejs = require('ejs');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));
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
const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`App started on port ${port}`);
});