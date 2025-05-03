const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../utils/db');
const config = require('../config');

class LoginController {
    async register(req, res) {
        const { name, email, password } = req.body;

        try {
            const pool = await poolPromise;
            const hashedPassword = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

            const result = await pool
                .request()
                .input('name', sql.VarChar, name)
                .input('email', sql.VarChar, email)
                .input('password', sql.VarChar, hashedPassword)
                .query(
                    'INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)'
                );

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        try {
            const pool = await poolPromise;

            const result = await pool
                .request()
                .input('email', sql.VarChar, email)
                .query('SELECT * FROM Users WHERE email = @email');

            const user = result.recordset[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.status(200).json({ message: 'Login successful', token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new LoginController();