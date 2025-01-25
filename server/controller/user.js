const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

secretKey = 'lenden$123@';

async function handleUserRegister(req, res) {
    const { name, username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error checking username' });
            }
            if (row) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            else {
                db.run(`
                    INSERT INTO users (name, username, password)
                    VALUES (?, ?, ?) `, [name, username, hashedPassword],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error registering user' });
                        }
                        res.status(201).json({ message: 'User registered successfully' });
                    }
                );
            }
        });
        
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ error: 'Error hashing password' });
    }
    
}
async function handleUserLogin(req, res) {
    const { username, password } = req.body;
    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, user) => {
            if (err) {
            return res.status(500).json({ error: 'Error logging in' });
            }
            if (!user) {
            return res.status(401).json({ error: 'Username not found' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
            }
            const token = jwt.sign({ userId: user.id, userName: user.username, name: user.name }, secretKey);
            const id = user.id; 
            return res.status(200).json({ message: 'Login successful', id, token }); 
        }
    );
}

async function handleUserUpdate(req, res) {
    const { username } = req.params;
    const { name } = req.body;
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;
        db.run(
            `UPDATE users SET name = ? WHERE username = ? AND id = ?`,
            [name, username, userId],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error updating profile' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'User not found or not authorized' });
                }
                res.status(200).json({ message: 'Profile updated successfully' });
            }
        );
    } catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token' });
    }
}

async function handleFetchUser(req, res) {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try{
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;
        db.get(`SELECT id, username, name FROM users WHERE id = ?`, [userId], (err, user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ user });
        });
    }catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token' });
    } 
}


module.exports = {handleUserRegister, handleUserLogin, handleUserUpdate, handleFetchUser};