const { pool } = require('../db/db');

const getUsers = async (req, res) => {
    try {
        const query = 'SELECT * FROM "Users"';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getBatches = async (req, res) => {
    try {
        const query = 'SELECT * FROM Batch';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getUsersWithPendingPayment = async (req, res) => {
    try {
        const query = 'SELECT * FROM "Users" WHERE payment_status = $1';
        const values = ['pending'];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users with pending payment:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getUsersWithCompletedPayment = async (req, res) => {
    try {
        const query = 'SELECT * FROM "Users" WHERE payment_status = $1';
        const values = ['completed'];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users with pending payment:', error);
        res.status(500).send('Internal Server Error');
    }
};

const addUser = async (req, res) => {
    try {
        const { name, age, batch_id, enrollment_date, last_payment_date, payment_status, user_pswd } = req.body;
        const query = `
      INSERT INTO "Users" (name, age, batch_id, enrollment_date, last_payment_date, payment_status, user_pswd)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
        const values = [name, age, batch_id, enrollment_date, last_payment_date, payment_status, user_pswd];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const changeBatchByUser = async (req, res) => {
    try {
        const { user_id, new_batch_id, user_pswd } = req.body;

        // Fetch user details including the stored password
        const userQuery = 'SELECT user_pswd FROM "Users" WHERE user_id = $1';
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const storedPassword = userResult.rows[0].user_pswd;

        // Check if the provided password matches the stored password
        if (user_pswd !== storedPassword) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // If password is correct, update the batch
        const updateQuery = `
        UPDATE "Users"
        SET batch_id = $1
        WHERE user_id = $2
        RETURNING *`;

        const updateValues = [new_batch_id, user_id];
        const result = await pool.query(updateQuery, updateValues);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error changing batch by user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const submitPaymentRequestByUser = async (req, res) => {
    try {
        const { user_id, user_pswd } = req.body;

        // Fetch user details including the stored password
        const userQuery = 'SELECT user_pswd FROM "Users" WHERE user_id = $1';
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const storedPassword = userResult.rows[0].user_pswd;

        // Check if the provided password matches the stored password
        if (user_pswd !== storedPassword) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // If password is correct, update payment details
        const updateQuery = `
        UPDATE "Users"
        SET payment_status = 'completed',
            last_payment_month = CURRENT_DATE
        WHERE user_id = $1
        RETURNING *`;

        const updateValues = [user_id];
        const result = await pool.query(updateQuery, updateValues);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error submitting payment request by user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const deleteUser = async (req, res) => {
    try {
        const { user_id, user_pswd } = req.body;

        // Fetch user details including the stored password
        const userQuery = 'SELECT user_pswd FROM "Users" WHERE user_id = $1';
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const storedPassword = userResult.rows[0].user_pswd;

        // Check if the provided password matches the stored password
        if (user_pswd !== storedPassword) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // If password is correct, delete the user
        const deleteQuery = `
        DELETE FROM "Users"
        WHERE user_id = $1
        RETURNING *`;

        const deleteValues = [user_id];
        const result = await pool.query(deleteQuery, deleteValues);

        res.json({ message: 'User deleted successfully', deletedUser: result.rows[0] });
    } catch (error) {
        console.error('Error deleting user by user:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getBatches, getUsers, addUser, changeBatchByUser, getUsersWithPendingPayment, submitPaymentRequestByUser, getUsersWithCompletedPayment, deleteUser };
