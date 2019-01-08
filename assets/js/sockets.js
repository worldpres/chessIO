$(() => {

    let socket = io();

    socket.on('hello', (name) => {
        console.log(name);
        socket.emit('hello', 'Here I am');
    });

});