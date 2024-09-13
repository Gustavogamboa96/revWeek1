// Import the readline module for handling user input in the console
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout // Write to standard output (console)
});


const groceryList = [{name: "butter", quantity: 1, price: 5, bought: false}];

const initList = () => {rl.question('Welcome to the grocery shopping tracker! \n Enter a command: \n 1. See list \n 2. Add item to list \n 3. Remove from list\n 4. Check item off/on \n', (command) => {
	switch (command) {
        case '1':
          //display list
          console.log("Here is the list:")
          groceryList.forEach((item) => {
            console.log(item.name + (item.bought ? "\u2611" : "\u2610"))
            });
            initList();
          break;
        case '2':
          // add to the list
          const item = {};
          console.log("Add item to the list:");
          rl.question("Enter item name: ", (name) => {
            item.name = name;
            rl.question("Enter item quantity: ", (quantity) => {
                item.quantity = quantity;
                rl.question("Enter item price: ", (price) => {
                    item.price = price;
                    item.bought = false;
                    groceryList.push(item);
                    console.log("Item added!");
                    initList();
                });
            });
          });
          break;
        case '3':
            //remove item from list
                
            groceryList.forEach((item, index) => {

                console.log(index+1 + ". " + item.name + (item.bought ? "\u2611" : "\u2610"))
                
                });
            rl.question("Select an item to remove: ", (number) => {
                groceryList.splice(Number(number) -1, 1);
                console.log('Item deleted!');
                initList();
            })

            break;
        case '4':
            //Toggle bought or not
            console.log("Check item off/on: ")
            groceryList.forEach((item, index) => {
                console.log(index+1 + ". " + item.name + (item.bought ? "\u2611" : "\u2610"))
                });
            rl.question("Select item to check off/on: ", (number) =>{
                groceryList[number-1].bought = !groceryList[number-1].bought;
                console.log(groceryList[number-1].bought ? `${groceryList[number-1].name} has been checked!` : `${groceryList[number-1].name} has been unchecked!`);
                initList();
            })
            
            break;
        default:
          initList();
      }
});
}

initList();