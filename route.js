const bcrypt = require('bcrypt');
const db = require('./database.js')
const express = require('express');

const router = express.Router()

 require('./auth.js')
// Registration
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    console.log(req.body)
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert user into the database
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Error registering user: ', err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          res.status(201).json({ message: 'User registered successfully' });
        }
      }
    );
  });
  
  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Check if the user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Error logging in: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else if (results.length === 0) {
        res.status(401).json({ message: 'Invalid email or password' });
      } else {
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
  
        if (isPasswordValid) {
          const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: 'Invalid email or password' });
        }
      }
    });
  });
  

//  app.get('/profile', authenticateToken, (req, res) => {
//     console.log('ddddd')
    // Access user info with req.user.userId
    // Fetch and send the user's profile data here
  

// });

module.exports = router