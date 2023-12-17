const {pool} = require('../db/db');

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

module.exports = { getBatches };
