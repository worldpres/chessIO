$(() => {

    // let socket = io();
    let socket = io('http://localhost:3000', { transports: ['websocket']}); //correct for socketio because of browser-sync proxy

    socket.on('welcome', (name) => {
        if (localStorage.name) socket.emit('thats my name', localStorage.name);
        else localStorage.name = name;
    });

});