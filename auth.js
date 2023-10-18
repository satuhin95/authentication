const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token missing.' });
    }
  
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  }
  
  // Example protected route
 
 
 // app.get('/profile', authenticateToken, (req, res) => {
    // Access user info with req.user.userId
    // Fetch and send the user's profile data here
  

//});
  