const express = require('express');
const { addPlayerToQueue } = require('../controller/gameCreate');
const { handlePlayerMove, handleFetchGame } = require('../controller/gamePlay');

const router = express.Router();

router.post('', async(req, res) => {
    try {
        await addPlayerToQueue(req, res);
    } catch (error) {
        console.log('Error creating game:', error);
        res.status(500).json({ error: 'Error creating game' });
    }

});

router.get('/:gameId', async(req, res) => {
    try {
        await handleFetchGame(req, res);
    }catch (error) {
        console.log('Error fetching game:', error);
        res.status(500).json({ error: 'Error fetching game' });
    }
});

router.post('/:gameId/move', async(req, res) => {
    try {
        await handlePlayerMove(req, res);
    }catch (error) {
        console.log('Error making move:', error);
        res.status(500).json({ error: 'Error making move' });
    }
});

module.exports = router;