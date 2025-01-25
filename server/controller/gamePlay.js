const { checkWinner } = require('../gameLogic');

const db = require('../database/db');

async function handlePlayerMove (req, res) {
    const { gameId, board } = req.body;
    const serializedBoard = JSON.stringify(board);

    const currentPlayer = +req.body.currentPlayer;
    const playerId = +req.body.playerId;
    if (!gameId || !board || !Array.isArray(board) || board.length !== 9 || !currentPlayer) {
        return res.status(400).json({ message: "Invalid input data" });
    }    
    const winner = await checkWinner(board);
    if (winner != null) {
        if(winner.type === 'draw'){
            db.run(
                `UPDATE games SET type = ?, index_id = ?, board = ?, current_turn = ?, status = 'draw' WHERE id = ?`, [winner.type, winner.index, serializedBoard, currentPlayer, gameId], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error updating game' });
                    }
                }
            );
            return res.status(200).json({message: 'Game is a draw'});
        }else {
            const gameWinner = playerId;
            // await db.updateGame(game);
            db.run(
                `UPDATE games SET winner_id = ?, type = ?, index_id = ?, board = ?, current_turn = ?, status = 'completed' WHERE id = ?`, [gameWinner, winner.type, winner.index, serializedBoard, currentPlayer, gameId], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error updating game' });
                    }
                }
            );
            return res.status(200).json({winner: winner.winner, type: winner.type, index: winner.index});
        }
    }else {
        db.run(`UPDATE games SET board = ?, current_turn = ? WHERE id = ?`, [serializedBoard, currentPlayer, gameId], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: 'Error updating game' });
                    }else{
                        return res.status(200).json({message: 'Move successful'});
                    }
                }
            );
    }
    
};

async function handleFetchGame (req, res) {
    const gameId = req.params.gameId;
    if (!gameId) {
        return res.status(400).json({ message: "Game Id not found" });
    }
    await db.get(`SELECT * FROM games WHERE id = ?`, [gameId], (err, game) => {
        if (err) {
            return res.status(404).json({ error: 'Game not found' });
        }else{
            res.status(200).json(game);
        }
    });
};

module.exports = { handlePlayerMove, handleFetchGame };