const express = require('express');
const app = express();
const http = require('http').Server(app);
const ip = require('ip');
const port = process.env.PORT || 3000;
const io = require('socket.io')(http);

http.listen(port, () => {
    console.log(`listening on ${ip.address()}:${port}`);
});

app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.sendFile(`index.html`);
});

let users = [];

io.on('connection', (socket) => {

    users.push({
        id: socket.id,
        name: `user${new Date().getTime()}`,
    });

    socket.on('disconnect', () => {
        users = users.filter(v => v.id !== socket.id);
    });
    
    socket.emit('hello', users.find(v => v.id === socket.id).name);

    socket.on('hello', (msg) => {
        console.log(msg);
        console.log(users);
    });

});