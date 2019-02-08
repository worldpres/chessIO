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

/**
 * SOCKET.IO
 */

let users = [];

io.on('connection', (socket) => {

    users.push({
        id: socket.id,
        name: `user${new Date().getTime()}`,
        status: ``,
        vs: ``,
    });

    socket.on('disconnect', () => {
        users = users.filter(v => v.id != socket.id);
    });

    socket.emit('welcome', users.find(v => v.id == socket.id).name);

    socket.on('thats my name', (name) => {
        users.find(v => v.id == socket.id).name = name;
        let player = users.find(v => v.id == socket.id);
        let opponent = users.find(v => v.vs == player.name);
        if (opponent) {
            lib.pair2players(users.find(v => v.id == socket.id), opponent.name);
            socket.emit('want to play', opponent.name);
        }
    });

    socket.on('want to play', () => {
        users.find(v => v.id == socket.id).status = `waiting`;
        let waitingUsers = users.filter(v => v.status == `waiting` && v.id != socket.id);
        if (waitingUsers.length) {
            let opponent = waitingUsers.shift();
            socket.emit('want to play', opponent.name);
            io.to(opponent.id).emit('want to play', users.find(v => v.id == socket.id).name);
            lib.pair2players(users.find(v => v.id == socket.id), opponent.name);
            lib.pair2players(users.find(v => v.id == opponent.id), users.find(v => v.id == socket.id).name);
        } else {
            socket.emit('want to play', false);
        }
    });

});