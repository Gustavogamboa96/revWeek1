const http = require("http");
const fs = require("fs").promises;
const { getList, addItem, updateItem, removeItem } = require("./AWS-API-DAO");

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
                const data = await removeItem(item);

                res.statusCode = 200; 
                res.end(JSON.stringify({message: `DELETE request handled`}));
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

