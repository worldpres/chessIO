function pair2players(playerObject, opponentName, firstTime = false) {
    Object.assign(playerObject, {
        status: `playing`,
        vs: opponentName
    });
    if (firstTime) {
        Object.assign(playerObject, {
            pieces: {
                wKing: `41`,
                bKing: `48`,
                wQueen: `51`,
                bQueen: `58`,
                wRooks: [`11`, `81`],
                bRooks: [`18`, `88`],
                wBishop: [`31`, `61`],
                bBishop: [`38`, `68`],
                wKnight: [`21`, `71`],
                bKnight: [`28`, `78`],
                wPawns: [`12`, `22`, `32`, `42`, `52`, `62`, `72`, `82`],
                bPawns: [`17`, `27`, `37`, `47`, `57`, `67`, `77`, `87`]
            }
        });
    }
}

module.exports = {
    pair2players: pair2players,
}