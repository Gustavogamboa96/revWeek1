const express = require("express");
const router = express.Router();
const EmployeeService = require('../service/EmployeeService');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/tickets', authenticateToken, async (req, res) => {
    const {amount, description, type} = req.body;
    const email = req.user.email;
    const role = req.user.role;
  
    try{
      const data = await EmployeeService.createTicket(email, role, amount, description, type);
      res.status(201).json({ message: `Ticket created succesfully: ${JSON.stringify(data)}` });
    } catch(error) {
      res.status(401).json({ message: error.message });
    }
  
  });

  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Get the token from the "Bearer <token>" format

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token and decode the payload
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Attach user info (from token payload) to the request object
        req.user = user;
        next();
    });
}

module.exports = router;