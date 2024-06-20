// Controller for authentication logic
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    User.findByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (user) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user
        const newUser = { username, email, password: hashedPassword  };
        User.create(newUser, (err, userId) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully', userId });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    User.findByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create and sign a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } ,message : "logged in"});
    });
};

exports.refreshToken = (req,res) =>{
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.id, (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate new token with updated expiration time
      const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Respond with the new token
      res.status(200).json({ token: newToken });
    });
  } catch (err) {
    console.error('Error refreshing token:', err);
    return res.status(403).json({ error: 'Invalid token' });
  }
};