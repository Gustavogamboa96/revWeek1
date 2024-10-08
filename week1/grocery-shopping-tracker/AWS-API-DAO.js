const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const uuid = require("uuid");
const {DynamoDBDocumentClient, 
        GetCommand,
        PutCommand,
        UpdateCommand,
        DeleteCommand,
        ScanCommand,
        QueryCommand} = require("@aws-sdk/lib-dynamodb");
// const uuid = require("uuid");


const client = new DynamoDBClient({region: "us-east-1"});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "groceries";


async function getList(){
    const command  = new ScanCommand({
        TableName
    })
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (err) {
        console.error(err);
        throw err; 
    }
}
// console.log(getList());
async function addItem(Item){
    let item_id = uuid.v4();
    Item["item-id"] = item_id;
    const command = new PutCommand({
        TableName,
        Item
    });
    
    try {
        const data = await documentClient.send(command);
        return data
        
    } catch (err) {
        console.error(err);
        throw err; 
    }

}

// async function createItem(name, price, quantity, purchased){
//     let item_id = uuid.v4();
    

//     let data = await addItem({
//         "item-id": item_id,
//         name,
//         price,
//         quantity,
//         purchased
//     });
//     console.log(data);
// }


// addItem(item)
// .then(data => console.log(data));

async function findByName(itemName){
    const command = new QueryCommand({
        TableName: "groceries",
        IndexName: "name-index", // GSI name
        KeyConditionExpression: "#n = :name",
        ExpressionAttributeNames: {
            "#n" : "name"
        },
        ExpressionAttributeValues: {
            ":name": itemName
        }
    });
    try {
        const data = await documentClient.send(command);
        if (data.Items && data.Items.length > 0) {
            return data.Items[0]; // Assuming there's only one match
        } else {
            throw new Error("Item not found");
        }
    } catch (err) {
        console.error("Error querying the item:", err);
        throw err;
    }
}

async function updateItem(Item){

    const itemToUpdate = await findByName(Item.name);
    
    const key = {"item-id": itemToUpdate["item-id"]};


    let updateExpression = 'set ';
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    Object.keys(Item).forEach((attribute, index) => {
        const attrName = `#attr${index}`;
        updateExpression += `${attrName} = :${attribute}`;
        
        if(index < Object.keys(Item).length -1){
            updateExpression += ', ';
        }

        expressionAttributeValues[`:${attribute}`] = Item[attribute];
        expressionAttributeNames[attrName] = attribute;
    })

    const command  = new UpdateCommand({
        TableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "ALL_NEW"
    });
    try {
        const data = await documentClient.send(command);
        return data.Attributes;
        
    } catch (err) {
        console.error(err);
        throw err; 
    }

    
}


async function removeItem(Item){

    const itemToDelete = await findByName(Item.name);
    
    const key = {"item-id": itemToDelete["item-id"]};

        const command = new DeleteCommand({
          TableName,
          Key: key,
        })
    try {
       const data = documentClient.send(command);
       return data;
        
    } catch (err) {
        console.error(err);
        throw err; 
    }

    
}

module.exports = {
    getList, addItem, updateItem, removeItem
    };