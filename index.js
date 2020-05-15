const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('chat message', (data) => {
        console.log('message : ' + data);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
