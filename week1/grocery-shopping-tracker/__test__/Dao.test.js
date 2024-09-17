// shoppingListDAO.test.js

const { getList, addItem, updateItem, removeItem } = require("../APIDAO");
const fs = require('fs').promises;
const path = require('path');

// Mock the fs module
jest.mock('fs');

describe('DAO Tests', () => {
//   beforeEach(() => {
//     fs.writeFile.mockClear();
//   });

jest.mock('fs', () => ({
    promises: {
      writeFile: jest.fn(),
      readFile: jest.fn(),
    },
  }));

  test('should write shopping list to data.json', async () => {
    const shoppingList = [{ name: 'Milk', price: 2.99 }];
    
    // Call the function to write the shopping list
    addItem(shoppingList[0]);

    // Dynamically generate the correct file path
    const filePath = path.join(__dirname, '../data.json');

    // Check if fs.writeFileSync was called with the correct arguments
    expect(fs.writeFile).toHaveBeenCalledWith(filePath, JSON.stringify(shoppingList[0], null, 2));
  });
});