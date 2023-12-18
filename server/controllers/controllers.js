const { pool } = require('../db/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { user_name, user_pswd } = req.body;

        if (user_name === 'admin') {
            if (user_pswd !== process.env.ADMIN_PSWD) {
                return res.status(403).json({ error: 'Authentication failed' });
            }
        }
        else {

            // Verify user credentials against the database
            const userQuery='SELECT * FROM "Users" WHERE user_name = $1';
            const userResult = await pool.query(userQuery, [user_name]);
            if (userResult.rows.length === 0) {
                return res.status(401).json({ error: 'User not found!' });
            }

            const authQuery = 'SELECT * FROM "Users" WHERE user_name = $1 AND user_pswd = $2';
            const authResult = await pool.query(authQuery, [user_name, user_pswd]);

            if (authResult.rows.length === 0) {
                return res.status(401).json({ error: 'Wrong Password!' });
            }
        }

        // If credentials are valid, generate a JWT token
        const user = { user_name, user_pswd };
        const token = jwt.sign(user, process.env.JWT_KEY);

        // Send the token back to the client
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const getUsers = async (req, res) => {
    try {
        const query = `
        SELECT
        u.user_id,
        u.user_name,
        u.age,
        b.batch_time,
        u.enrollment_date,
        u.last_payment_date,
        u.payment_status
    FROM "Users" u
    JOIN "Batches" b ON u.batch_id = b.batch_id
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const getUserDetails = async (req, res) => {
    const user_name = req.params.username;
    try {
        const query = `
                SELECT
                    u.user_name,
                    b.batch_time,
                    u.enrollment_date,
                    u.last_payment_date,
                    u.payment_status
                FROM "Users" u
                JOIN "Batches" b ON u.batch_id = b.batch_id
                WHERE u.user_name = $1;
            `;

        const result = await pool.query(query, [user_name]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user_name = req.params.username;
        const deleteQuery = `
        DELETE FROM "Users"
        WHERE user_name = $1
        RETURNING *`;

        const result = await pool.query(deleteQuery, [user_name]);

        res.json({ message: 'User deleted successfully', deletedUser: result.rows[0] });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const getBatches = async (req, res) => {
    try {
        const query = 'SELECT * FROM "Batches"';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const getUsersWithPendingPayment = async (req, res) => {
    try {
        const query = 'SELECT * FROM "Users" WHERE payment_status = $1';
        const values = ['pending'];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching "Users" with pending payment:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const getUsersWithCompletedPayment = async (req, res) => {
    try {
        const query = 'SELECT * FROM "Users" WHERE payment_status = $1';
        const values = ['completed'];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching "Users" with completed payment:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const addUser = async (req, res) => {
    try {
        console.log("data received:", req.body);
        const { user_name, age, batch_id, user_pswd } = req.body;

        // Check if user_name already exists
        const checkUserQuery = 'SELECT COUNT(*) FROM "Users" WHERE "user_name" = $1';
        const checkUserResult = await pool.query(checkUserQuery, [user_name]);

        if (checkUserResult.rows[0].count > 0) {
            // User_name already exists, return an error response
            return res.status(400).json({ error: 'User already exists. Please log in.' });
        }

        const query = `
        INSERT INTO "Users" ("user_name", "age", "batch_id", "user_pswd", "enrollment_date", "last_payment_date", "payment_status")
      VALUES ($1, $2, $3, $4, CURRENT_DATE ,CURRENT_DATE, 'completed')
      RETURNING *`;
        const values = [user_name, age, batch_id, user_pswd];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error! Make sure you are connected to the internet.' });
    }
};

const changeBatchByUser = async (req, res) => {
    try {

        const { batch_id, user_name } = req.body;

        const updateQuery = `
        UPDATE "Users"
        SET batch_id = $1
        WHERE user_name = $2
        RETURNING *`;

        const updateValues = [batch_id, user_name];
        const result = await pool.query(updateQuery, updateValues);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error changing batch:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const submitPaymentRequestByUser = async (req, res) => {
    try {
        const user_name = req.params.username;
        const updateQuery = `
        UPDATE "Users"
        SET payment_status = 'completed',
        last_payment_date = CURRENT_DATE
        WHERE user_name = $1
        RETURNING *`;

        const result = await pool.query(updateQuery, [user_name]);

        res.json({ message: 'Payment done successfully' , result});
    } catch (error) {
        console.error('Error submitting payment:', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

const describe = async (req, res) => {
    try {
        const query = `
        SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Users';
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ error: 'Internal Server! Make sure you are connected to the internet.' });
    }
};

module.exports = {
    getBatches, getUsers, addUser, changeBatchByUser, getUsersWithPendingPayment,
    submitPaymentRequestByUser, getUsersWithCompletedPayment, deleteUser, login, describe, getUserDetails
};
