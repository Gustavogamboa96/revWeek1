const express = require('express');
const AuthService = require('./AuthService');
const EmployeeService = require('./EmployeeService');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const JWT_SECRET = "voXUv4xSHdEkYA9pGaHGkI+TcIvvJgjtMVdMaoCHQ94=";

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await AuthService.login(email, password);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true if you're using HTTPS
      sameSite: 'Strict', // Can be 'Strict' or 'Lax'
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.post('/register', async (req, res) => {
  const { email, password, role} = req.body;
  try {
    const data = await AuthService.register(email, password, role);
    res.status(201).json({ message: "User added succesfully" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.post('/create-ticket', async (req, res) => {
  const {amount, description, type} = req.body;
  const token = req.cookies.token;
    
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const { email, role } = decoded;

  try{
    const data = await EmployeeService.createTicket(email, role, amount, description, type);
    res.status(201).json({ message: "Ticket created succesfully" });
  } catch(error) {
    res.status(401).json({ message: error.message });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port which is ${PORT}`);
});
