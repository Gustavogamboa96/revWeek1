const {addItem, getAllItemsByEmail} = require('../repository/TicketsDAO');
const uuid = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET;

async function createTicket(email, role, amount, description, type){
    if(!amount || !description){
        throw new Error('Must have amount and description');
    }
    if(role !== "employee"){
        throw new Error("Managers can't create tickets");
    }
    if(amount < 1){
        throw new Error("Invalid amount");
    }
    if(!type){
        type = "other";
    }
    const ticketId = uuid.v4()
    const status = "pending";

    const ticket = {email, ticketId, amount, description, status, type};

    return addItem(ticket);
}

async function getAllTickets(email, role){
    if(role !== "employee"){
        throw new Error("Managers can't access this route");
    }

    return getAllItemsByEmail(email);

}

async function getTicketsByType(email, role, type){
    if(role !== "employee"){
        throw new Error("Managers can't access this route");
    }
    const all = await getAllItemsByEmail(email);
    const results = all.filter(item => item.type === type)

    return results;

}


module.exports = {createTicket, getAllTickets, getTicketsByType};