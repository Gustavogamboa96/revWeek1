const {getList, addItem, updateItem, findByName, queryEmployeesByRole} = require('./AWS-API-DAO');
const uuid = require("uuid");

// getItem(key)
//     .then(data => console.log(data))
//     .catch(err => console.error(err));

async function createItem(name, price, quantity, purchased){
    let item_id = uuid.v4();
    

    let data = await addItem({
        "item-id": item_id,
        name,
        price,
        quantity,
        purchased
    });
    console.log(data);
}

async function updateExistingItemByName(){
const updatedItem = {"name":"tallow","price":5.99, "quantity": 7, "purchased": true};

const item = await findByName("tallow");

const key = {"item-id": item["item-id"]};

const data = updateItem(key, updatedItem);

return data;
}

updateExistingItem()
.then(data => console.log(data));
