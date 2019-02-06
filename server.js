'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const ip = require('ip');
const port = process.env.PORT || 3000;
const io = require('socket.io')(http);

http.listen(port, () => {
    console.log(`[NodeJS] listening on ${ip.address()}:${port}`);
});

app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
    res.sendFile(`index.html`);
});

const lib = require('./lib');
console.log(lib.fun());

/**
 * SOCKET.IO
 */

let users = [];

io.on('connection', (socket) => {

    users.push({
        id: socket.id,
        name: `user${new Date().getTime()}`,
    });

    socket.on('disconnect', () => {
        users = users.filter(v => v.id != socket.id);
    });

    socket.emit('welcome', users.find(v => v.id == socket.id).name);

    socket.on('thats my name', (name) => {
        users.find(v => v.id == socket.id).name = name;
        console.log(users);
    });

});