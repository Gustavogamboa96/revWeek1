const express = require("express");
const router = express.Router();
const EmployeeService = require('../service/EmployeeService');
const {authenticateToken} = require('../util/AuthenticateToken');

//to create tickets
router.post('/tickets', authenticateToken, async (req, res) => {
    const {amount, description, type} = req.body;
    const email = req.user.email;
    const role = req.user.role;

    try{
      const data = await EmployeeService.createTicket(email, role, amount, description, type);
      res.status(201).json({ message: `Ticket created succesfully: `, amount, description, type });
    } catch(error) {
      res.status(401).json({ message: error.message });
    }
  
  });

//to see all my tickets
router.get('/tickets', authenticateToken, async (req, res) =>{
    const email = req.user.email;
    const role = req.user.role
//add filter by type
    const {type} = req.query;
    try{

    if(!type){
      data = await EmployeeService.getAllTickets(email, role);
      return res.status(200).json({message: `Here's a list of all tickets for ${email}:`, data});
    }else{
      data = await EmployeeService.getTicketsByType(email, role, type);
      return res.status(200).json({message: `Here's a list of all tickets for ${email} of type: ${type}:`, data});
    }
  
  }catch(error){
        res.status(401).json({message: error.message});
    }    
})




module.exports = router;