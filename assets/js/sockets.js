$(() => {

    let socket = io();

    socket.on('welcome', (name) => {
        if (localStorage.name) socket.emit('thats my name', localStorage.name);
        else localStorage.name = name;
    });

    $('#play').click(() => {
        socket.emit('want to play');
    });

    socket.on('want to play', (opponent) => {
        $('#play').hide();
        if (opponent) {
            if (typeof(waiting) == `number`) clearTimeout(waiting);
            $('#info').text(`Your opponent: ${opponent}`);
        } else {
            $('#info').text(`Waiting for opponent...`);
            waiting = setTimeout(() => {
                socket.emit('want to play');
            }, 5000);
        }
    });
});