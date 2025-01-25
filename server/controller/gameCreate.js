const db = require('../database/db');

let playerQueue = [];

function waitingForPlayer(playerQueue, timeout = 240000) {
    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
            if (playerQueue.length >= 2) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(checkInterval);
            if (playerQueue.length < 2) {
                reject(new Error('No player found'));
            }
        }, timeout);
    });
}

async function addPlayerToQueue(req, res) {
    const playerId = req.body.id;
    playerQueue.push({playerId, res});

    try {
        await waitingForPlayer(playerQueue);


        if (playerQueue.length >= 2) {
            const player1 = playerQueue.shift();
            const player2 = playerQueue.shift();

            if(player1.playerId === player2.playerId) {
                error ='Player cannot play with themselves';
                player1.res.status(400).json({ error });
                return
            }

            try{
                const gameDetail = await createNewGame(player1.playerId, player2.playerId);

                player1.res.status(200).json(gameDetail);
                player2.res.status(200).json(gameDetail);
            }
            catch (error) {
                const errorMessage = { message: 'Error Creating Game' };
                player1.res.status(400).json(errorMessage);
                player2.res.status(400).json(errorMessage);
            }
        }
    }
    catch (error) {
        playerQueue.forEach(({ res }) => {
            res.status(406).json({ message: 'No player found' });
        });
        playerQueue = [];
    }


}

async function createNewGame(player1Id, player2Id) {

    return new Promise((resolve, reject) => {
        db.run(`
            INSERT INTO games (player1_id, player2_id, current_turn, status)
            VALUES (?, ?, ?, ?)
        `, [player1Id, player2Id, player1Id, 'ongoing'], function(err) {
            if (err) {
                reject(err);
            } else {
                const gameDetail = { 
                    id: this.lastID, 
                    player1Id, 
                    player2Id 
                };
                resolve(gameDetail);
            }
        });
    });
    
}



module.exports = { addPlayerToQueue };