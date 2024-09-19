const {addTicket} = require('../repository/TicketsDAO');
const uuid = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET;

async function createTicket(email, role, amount, description, type){
    if(!amount || !description){
        throw new Error('Must have amount and description');
    }
    if(role !== "employee"){
        throw new Error("Managers can't create tickets");
    }
    if(!type){
        type = "miscelaneous";
    }
    const ticketId = uuid.v4()
    const status = "pending";

    const ticket = {email, ticketId, amount, description, status, type};

    return addTicket(ticket);
}

module.exports = {createTicket};