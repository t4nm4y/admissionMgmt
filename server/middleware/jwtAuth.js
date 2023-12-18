const jwt = require('jsonwebtoken');

function jwtAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    console.log("no token");
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_KEY); // Replace with your secret key

    // Attach the decoded user information to the request for further use
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("invalid token");
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = jwtAuth;
