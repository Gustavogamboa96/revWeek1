const http = require("http");
const fs = require("fs").promises;

const PORT = 3000

const server = http.createServer(async (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    let body = '';
    switch(req.method){
        case('GET'):
        try {
            const data = await getList(); // Wait for the data
            res.statusCode = 200;
            res.end(JSON.stringify({ message: `GET request handled`, data: data }));
        } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Error reading file' }));
        }
            break;
        case('POST'):
            // expects there to be a body
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            
            req.on('end', async () => {
                //logger.info(`Request body: ${body}`);

                const item = JSON.parse(body);
                addItem(item)

                res.statusCode = 201; // created
                res.end(JSON.stringify({message: "POST request handled", data: item}));
            });
            break;
        case('PUT'):
            // expects there to be a body
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                //logger.info(`Request body: ${body}`);

                const item = JSON.parse(body);
                updateItem(item);

                res.statusCode = 200; 
                res.end(JSON.stringify({message: "PUT request handled"}));
            });
            break;
        case('DELETE'):
            //res.statusCode = 200;
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                //logger.info(`Request body: ${body}`);

                const item = JSON.parse(body);
                removeItem(item);

                res.statusCode = 200; 
                res.end(JSON.stringify({message: "DELETE request handled"}));
            });
            break;
        default:
            res.statusCode = 405; // method not allowed
            res.end(JSON.stringify({message: "Method not supported"}))
            break;
    }

})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

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
        const data = await fs.readFile('data.json', 'utf8'); 
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