const {getAllItems, getItem, getItemsByStatus, updateItemById, addItem} = require('../repository/TicketsDAO');
const JWT_SECRET = process.env.JWT_SECRET;
const uuid = require('uuid');

async function getAllTickets(role){
    if(role !== "manager"){
        throw new Error("Employees can't access this route")
    }

    return getAllItems();
}

async function getTicketsByStatus(role, status){
    if(role !== "manager"){
        throw new Error("Employees can't access this route")
    }
    return getItemsByStatus(status);
}

async function processTicketById(email, role, ticketId, newStatus){
    if(role !== "manager"){
        throw new Error("Employees can't access this route")
    }
    if(!ticketId || !email){
        throw new Error("TicketId/Email can't be empty");
    }
    const ticket = await getItem(email, ticketId);
    //console.log(ticket.status);
    if(ticket){
        if(ticket.status !== "pending"){
            throw new Error("Already processed tickets can't be changed");
        }
    }else{
        throw new Error("Couldn't access that ticket");
    }
    return updateItemById(email, ticketId, newStatus);
}

async function createTicket(email, role, amount, description, type){
    if(!amount || !description){
        throw new Error('Must have amount and description');
    }
    if(role !== "manager"){
        throw new Error("employees can't create tickets on this route");
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



module.exports = {getAllTickets, getTicketsByStatus, processTicketById, createTicket};