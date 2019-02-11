$(() => {

    let socket = io();

    socket.on('welcome', (name) => {
        if (localStorage.name) socket.emit('thats my name', localStorage.name);
        else localStorage.name = name;
    });

    $('#play').click(() => {
        socket.emit('want to play');
    });

    let figures = {
        wKing: `&#9812;`,
        bKing: `&#9818;`,
        wQueen: `&#9813;`,
        bQueen: `&#9819;`,
        wRooks: `&#9814;`,
        bRooks: `&#9820;`,
        wBishop: `&#9815;`,
        bBishop: `&#9821;`,
        wKnight: `&#9816;`,
        bKnight: `&#9822;`,
        wPawns: `&#9817;`,
        bPawns: `&#9823;`
    }

    fieldDraw = (pieces) => {
        if (pieces) {
            for (let i = 8; i > 0; i--) {
                for (let j = 8; j > 0; j--) {
                    if ((i + j) % 2) $('#field').append('<div class="piece" id="' + j + '' + i + '"></div>');
                    else $('#field').append('<div class="piece white" id="' + j + '' + i + '"></div>');
                }
            }
            for (let piece in pieces) {
                if (typeof (pieces[piece]) == 'string') {
                    $('#field').find(`#${pieces[piece]}`).html(`<span class="${piece}">${figures[piece]}</span>`);
                }
                if (typeof (pieces[piece]) == 'object') {
                    for (let v of pieces[piece]) {
                        $('#field').find(`#${v}`).html(`<span class="${piece}">${figures[piece]}</span>`);
                    }
                }
            }
        }
    }

    socket.on('want to play', (opponent, pieces) => {
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
        fieldDraw(pieces);
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