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
            if (typeof (waiting) == `number`) clearTimeout(waiting);
            $('#info').text(`Your opponent: ${opponent}`);
        } else {
            $('#info').text(`Waiting for opponent...`);
            waiting = setTimeout(() => {
                socket.emit('want to play');
            }, 5000);
        }
    });

    socket.on('player left', () => {
        $('#info').text(`You opponent left, but we can wait for him about 5 seconds.`);
    });
    socket.on('player came back', (opponent) => {
        $('#info').text(`Your opponent ${opponent} came back.`);
    });
    socket.on('player gone', () => {
        $('#info').text(`You opponent gone. You can play with other players.`);
        $('#play').show();
    });

});