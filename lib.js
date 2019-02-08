function pair2players(playerObject, opponentName) {
    Object.assign(playerObject, {
        status: `playing`,
        vs: opponentName
    });
}

module.exports = {
    pair2players: pair2players,
}