const {getAllItems, getItem, getItemsByStatus, updateItemById} = require('../repository/TicketsDAO');
const JWT_SECRET = process.env.JWT_SECRET;

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
    console.log(ticket.status);
    if(ticket.status !== "pending"){
        throw new Error("Already processed tickets can't be changed");
    }
    return updateItemById(email, ticketId, newStatus);
}



module.exports = {getAllTickets, getTicketsByStatus, processTicketById};