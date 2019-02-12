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
        let player = users.find(v => v.id == socket.id);
        let opponent = users.find(v => v.vs == player.name);
        if (opponent) {
            io.to(opponent.id).emit('player left');
            setTimeout(() => {
                if (users.find(v => v.name == player.name)) {
                    io.to(opponent.id).emit('player came back', player.name);
                } else {
                    io.to(opponent.id).emit('player gone');
                    Object.assign(users.find(v => v.id == opponent.id), {
                        status: ``,
                        vs: ``
                    });
                }
            }, 5000);
        }
        users = users.filter(v => v.id != socket.id);
    });

    socket.emit('welcome', users.find(v => v.id == socket.id).name);

    socket.on('thats my name', (name) => {
        users.find(v => v.id == socket.id).name = name;
        let player = users.find(v => v.id == socket.id);
        let opponent = users.find(v => v.vs == player.name);
        if (opponent) {
            lib.pair2players(users.find(v => v.id == socket.id), opponent.name);
            users.find(v => v.id == socket.id).pieces = opponent.pieces;
            socket.emit('want to play', opponent.name, users.find(v => v.id == socket.id).pieces);
        }
    });

    socket.on('want to play', () => {
        users.find(v => v.id == socket.id).status = `waiting`;
        let waitingUsers = users.filter(v => v.status == `waiting` && v.id != socket.id);
        if (waitingUsers.length) {
            let opponent = waitingUsers.shift();
            lib.pair2players(users.find(v => v.id == socket.id), opponent.name, true);
            lib.pair2players(users.find(v => v.id == opponent.id), users.find(v => v.id == socket.id).name, true);
            socket.emit('want to play', opponent.name, users.find(v => v.id == socket.id).pieces);
            io.to(opponent.id).emit('want to play', users.find(v => v.id == socket.id).name, opponent.pieces);
        } else {
            socket.emit('want to play', false);
        }
    });

    socket.on('my move', (piece, from, to) => {
        let data = users.find(v => v.id == socket.id).pieces[piece];
        if (typeof (data) == `string`) {
            if (data == from) users.find(v => v.id == socket.id).pieces[piece] = to;
        }
        if (typeof (data) == `object`) {
            users.find(v => v.id == socket.id).pieces[piece] = data.map((v) => (v == from) ? to : v);
        }

        console.log(piece, from, to);

        let player = users.find(v => v.id == socket.id);
        users.find(v => v.vs == player.name).pieces = player.pieces;

        let opponent = users.find(v => v.vs == player.name);
        socket.emit('move', player.pieces);
        io.to(opponent.id).emit('move', opponent.pieces);
    });


});