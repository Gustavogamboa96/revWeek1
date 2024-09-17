const fs = require("fs").promises;

async function getList(){
    try {
        const data = await fs.readFile('data.json', 'utf8'); 
        return JSON.parse(data); 
    } catch (err) {
        console.error(err);
        throw err; 
    }

    
}

async function addItem(item){
    try {
        const data = await fs.readFile('./data.json', 'utf8'); 
        const jsonData= JSON.parse(data); 
        
        jsonData.groceryList.push(item);
        const newData = JSON.stringify(jsonData);

        await fs.writeFile("data.json", newData, "utf8", (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('New item has been added to the JSON file');
        });
        
    } catch (err) {
        console.error(err);
        throw err; 
    }

    
}


async function updateItem(itemToUpdate){
    try {
        const data = await fs.readFile('data.json', 'utf8'); 
        const jsonData= JSON.parse(data); 
        
        const indexToUpdate = jsonData.groceryList.findIndex(item => itemToUpdate.name  === item.name);

        if(indexToUpdate == -1){
            console.log('Item to update not found in the grocery list.');
            return;
        }

        jsonData.groceryList[indexToUpdate] = {...jsonData.groceryList[indexToUpdate], ...itemToUpdate};

        const newData = JSON.stringify(jsonData);

        await fs.writeFile("data.json", newData, "utf8", (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Item has been updated to the JSON file');
        });
        
    } catch (err) {
        console.error(err);
        throw err; 
    }

    
}

async function removeItem(itemToRemove){
    try {
        const data = await fs.readFile('data.json', 'utf8'); 
        const jsonData= JSON.parse(data); 
        
        const indexToRemove = jsonData.groceryList.findIndex(item => itemToRemove.name  === item.name);

        if(indexToRemove == -1){
            console.log('Item to remove not found in the grocery list.');
            return;
        }

        jsonData.groceryList.splice(indexToRemove, 1);

        const newData = JSON.stringify(jsonData);

        await fs.writeFile("data.json", newData, "utf8", (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Item has been removed from the JSON file');
        });
        
    } catch (err) {
        console.error(err);
        throw err; 
    }

    
}

module.exports = {getList, addItem, updateItem, removeItem};