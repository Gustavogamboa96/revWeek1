const express = require("express");
const router = express.Router();
const ManagerService = require('../service/ManagerService');
const {authenticateToken} = require('../util/AuthenticateToken');



router.get("/tickets", authenticateToken, async (req, res) => {
    const role = req.user.role;
    const {status} = req.query;
    let data;
    try{
    if(status){
        //if status param is pending it gets the pending tickets from all
        data = await ManagerService.getTicketsByStatus(role, status);
        return res.status(200).json({message: `Here's a list of all ${status} tickets:`, data});
    }else{
        //if no status then get all
        data = await ManagerService.getAllTickets(role);
        return res.status(200).json({message: `Here's a list of all tickets:`, data});
    }
    

    }catch(error){
            res.status(400).json({message: error.message});
    }
});

router.patch('/tickets', authenticateToken, async (req, res) =>{
    const role = req.user.role;
    const {email, ticketId, newStatus} = req.body;

    try{
        const data = await ManagerService.processTicketById(email, role, ticketId, newStatus);
        res.status(200).json({message: `The ticket has been updated`, data});
    }catch(error){
        res.status(400).json({message: error.message});
    }
})

router.post('/tickets', authenticateToken, async (req, res) => {
    const {amount, description, type} = req.body;
    const email = req.user.email;
    const role = req.user.role;

    try{
      const data = await ManagerService.createTicket(email, role, amount, description, type);
      res.status(201).json({ message: `Ticket created succesfully: `, data });
    } catch(error) {
      res.status(401).json({ message: error.message });
    }
  
  });

module.exports = router;