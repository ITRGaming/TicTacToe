const express = require('express');
const { handleUserRegister, handleUserLogin, handleUserUpdate, handleFetchUser } = require('../controller/user');

const router = express.Router();

router.post('/register', async(req, res) => {
    try {
        await handleUserRegister(req, res);
    }catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});
router.post('/login', async(req, res) => {
    try {
        await handleUserLogin(req, res);
    }catch (error) {
        console.error('Error login user:', error);
        res.status(500).json({ error: 'Error login user' });
    }
});


router.post('/:username', handleUserUpdate);

router.get('/', handleFetchUser);

module.exports = router;