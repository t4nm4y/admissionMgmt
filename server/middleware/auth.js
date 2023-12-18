// Authentication Middleware
const { pool } = require('../db/db');

const Auth = async(req, res, next)=> {
  const { user_name, user_pswd } = req.body;
  
  //for admin auth:
  if(user_name==='admin'){
    if(user_pswd===process.env.ADMIN_PSWD){
      next();
    }
    else {
      return res.status(403).json({ error: 'Authentication failed' });
    }
  }

  const userQuery = 'SELECT user_pswd FROM "Users" WHERE user_name = $1';
  const userResult = await pool.query(userQuery, [user_name]);

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const storedPassword = userResult.rows[0].user_pswd;

  // Check if the provided password matches the stored password
  if (user_pswd === storedPassword) {
    next(); // Authentication successful, proceed to the route
  } else {
    res.status(403).json({ error: 'Authentication failed' });
  }
}
module.exports = Auth;