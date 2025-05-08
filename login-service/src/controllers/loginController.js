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

            const token = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, {
                expiresIn: '1h',
            });

            //send the jwt in a http-only cookie
            // This prevents JavaScript from accessing the token, enhancing security
            res.cookie('token', token, {
                httpOnly: true, // Prevent JavaScript access
                sameSite: 'Lax', // Prevent CSRFS
                maxAge: 3600000, // 1 hour in milliseconds
            });
            console.log("cookie: ", token); // Log the cookie for debugging

            res.status(200).json({ message: 'Login successful'});
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getUser(req, res) {
        const token = req.cookies.token; // Extract the token from the cookie
        
        console.log("token: ", req.cookies); // Log the token for debugging

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, config.JWT_SECRET); // Decode the JWT
            res.status(200).json({ user: decoded }); // Send the user data to the frontend
        } catch (err) {
            console.error('Error decoding JWT:', err);
            res.status(401).json({ error: 'Invalid token' });
        }
    }
}

module.exports = new LoginController();