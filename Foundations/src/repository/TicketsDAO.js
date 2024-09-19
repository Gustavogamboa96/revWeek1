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

async function addItem(ticket){
    
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

async function getAllItems(){
    const command = new ScanCommand({
        TableName
    });
    
    try {
        const data = await documentClient.send(command);
        return data.Items;  // This will return all the items from the table
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getAllItemsByEmail(email){
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "email = :email",  // Condition for partition key
        ExpressionAttributeValues: {
            ":email": email  // Value to filter by
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;  // Return all matching items
    } catch (err) {
        console.error("Error querying items:", err);
        throw err;
    }
}

async function getItemsByStatus(status) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#status = :status",  // Filter by status
        ExpressionAttributeNames: {
            "#status": "status"  // "status" is a reserved word in DynamoDB, so we alias it
        },
        ExpressionAttributeValues: {
            ":status": status
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;  // Return filtered items
    } catch (err) {
        console.error("Error scanning for tickets:", err);
        throw err;
    }
}

async function updateItemById(email, ticketId, status){
    const command  = new UpdateCommand({
            TableName, 
            Key: {
            "email": email,
            "ticketId": ticketId 
            },
            UpdateExpression: "SET #status = :status",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": status
            },
            ReturnValues: "UPDATED_NEW"
    });

        try {
            const data = await documentClient.send(command);
            return data.Attributes;  // Return filtered items
        } catch (err) {
            console.error("Error updating ticket:", err);
            throw err;
        }
}

async function getItem(email, ticketId){
    const command = new GetCommand({
        TableName,
        Key: {
            "email": email,
            "ticketId": ticketId
            }  // Condition for partition key
    });

    try {
        const data = await documentClient.send(command);
        console.log("data:" + JSON.stringify(data.Item));
        return data.Item;  // Return all matching items
    } catch (err) {
        console.error("Error querying items:", err);
        throw err;
    }
}



module.exports = {addItem, getItem, getAllItemsByEmail, getAllItems, getItemsByStatus, updateItemById};