const express = require("express");
const router = express.Router();
const AuthService = require('../service/AuthService');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await AuthService.login(email, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });
  
router.post('/register', async (req, res) => {
    const { email, password, role} = req.body;
    try {
      const data = await AuthService.register(email, password, role);
      res.status(201).json({ message: "User added succesfully", email });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });

  module.exports = router;