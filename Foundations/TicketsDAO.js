const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const uuid = require("uuid");
const {DynamoDBDocumentClient, 
        GetCommand,
        PutCommand,
        UpdateCommand,
        DeleteCommand,
        ScanCommand,
        QueryCommand} = require("@aws-sdk/lib-dynamodb");


const client = new DynamoDBClient({region: "us-east-1"});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "Tickets";

async function addTicket(ticket){
    
    const command = new PutCommand({
        TableName,
        Item: ticket
    });
    try {
        const data = await documentClient.send(command);
        return data.Item;
    } catch (err) {
        console.error(err);
        throw err; 
    }

}

module.exports = {addTicket};