const { createTicket, getAllTickets } = require('../src/service/EmployeeService');
const { addItem, getAllItemsByEmail } = require('../src/repository/TicketsDAO');
const uuid = require('uuid');

// Mock the repository functions and uuid
jest.mock('../src/repository/TicketsDAO');
jest.mock('uuid');

describe('EmployeeService', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear any previous mock data
    });

    describe('createTicket', () => {
        it('should successfully create a ticket when given valid data', async () => {
            // Arrange
            const email = 'test@example.com';
            const role = 'employee';
            const amount = 150;
            const description = 'Travel reimbursement';
            const type = 'travel';

            // Mocking uuid and addItem
            const ticketId = '1234-uuid';
            uuid.v4.mockReturnValue(ticketId);
            addItem.mockResolvedValue({ success: true });

            // Act
            const result = await createTicket(email, role, amount, description, type);

            // Assert
            expect(addItem).toHaveBeenCalledWith({
                email,
                ticketId,
                amount,
                description,
                status: 'pending',
                type
            });
            expect(result).toEqual({ success: true });
        });

        it('should throw an error if the amount or description is missing', async () => {
            // Arrange
            const email = 'test@example.com';
            const role = 'employee';
            const amount = null;
            const description = '';

            // Act & Assert
            await expect(createTicket(email, role, amount, description, 'travel')).rejects.toThrow('Must have amount and description');
            expect(addItem).not.toHaveBeenCalled(); // Ensure the DAO function was not called
        });

        it('should throw an error if the role is not employee', async () => {
            // Arrange
            const email = 'test@example.com';
            const role = 'manager'; // Invalid role
            const amount = 100;
            const description = 'Office supplies';

            // Act & Assert
            await expect(createTicket(email, role, amount, description, 'office')).rejects.toThrow("Managers can't create tickets");
            expect(addItem).not.toHaveBeenCalled();
        });

        it('should default to "miscellaneous" type if no type is provided', async () => {
            // Arrange
            const email = 'test@example.com';
            const role = 'employee';
            const amount = 100;
            const description = 'Office supplies';
            
            // Mocking uuid and addItem
            const ticketId = '5678-uuid';
            uuid.v4.mockReturnValue(ticketId);
            addItem.mockResolvedValue({ success: true });

            // Act
            const result = await createTicket(email, role, amount, description);

            // Assert
            expect(addItem).toHaveBeenCalledWith({
                email,
                ticketId,
                amount,
                description,
                status: 'pending',
                type: 'miscelaneous'  // Ensure type defaults to 'miscelaneous'
            });
            expect(result).toEqual({ success: true });
        });
    });

    describe('getAllTickets', () => {
        it('should return all tickets for an employee', async () => {
            // Arrange
            const email = 'test@example.com';
            const role = 'employee';

            const mockTickets = [
                { ticketId: '123', amount: 100, description: 'Lunch reimbursement' },
                { ticketId: '456', amount: 200, description: 'Travel reimbursement' }
            ];

            getAllItemsByEmail.mockResolvedValue(mockTickets);

            // Act
            const result = await getAllTickets(email, role);

            // Assert
            expect(getAllItemsByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(mockTickets);
        });

        it('should throw an error if the role is not employee', async () => {
            // Arrange
            const email = 'test@example.com';
            const role = 'manager'; // Invalid role

            // Act & Assert
            await expect(getAllTickets(email, role)).rejects.toThrow("Managers can't access this route");
            expect(getAllItemsByEmail).not.toHaveBeenCalled();
        });
    });

});
