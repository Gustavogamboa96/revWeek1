const { getAllItems, getItem, getItemsByStatus, updateItemById } = require('../src/repository/TicketsDAO');
const ManagerService = require('../src/service/ManagerService');

// Mock the repository functions
jest.mock('../src/repository/TicketsDAO', () => ({
    getAllItems: jest.fn(),
    getItem: jest.fn(),
    getItemsByStatus: jest.fn(),
    updateItemById: jest.fn(),
}));

describe('Manager Service', () => {
    afterEach(() => {
        jest.clearAllMocks();  // Clear mocks after each test
    });

    describe('getAllTickets', () => {
        it('should throw an error if role is not manager', async () => {
            const role = 'employee';
            await expect(ManagerService.getAllTickets(role)).rejects.toThrow('Employees can\'t access this route');
        });

        it('should return all items if role is manager', async () => {
            const role = 'manager';
            const mockTickets = [{ id: 1 }, { id: 2 }];
            getAllItems.mockResolvedValue(mockTickets);

            const result = await ManagerService.getAllTickets(role);

            expect(getAllItems).toHaveBeenCalled();
            expect(result).toEqual(mockTickets);
        });
    });

    describe('getTicketsByStatus', () => {
        it('should throw an error if role is not manager', async () => {
            const role = 'employee';
            const status = 'pending';

            await expect(ManagerService.getTicketsByStatus(role, status)).rejects.toThrow('Employees can\'t access this route');
        });

        it('should return tickets by status if role is manager', async () => {
            const role = 'manager';
            const status = 'pending';
            const mockTickets = [{ id: 1, status: 'pending' }];
            getItemsByStatus.mockResolvedValue(mockTickets);

            const result = await ManagerService.getTicketsByStatus(role, status);

            expect(getItemsByStatus).toHaveBeenCalledWith(status);
            expect(result).toEqual(mockTickets);
        });
    });

    describe('processTicketById', () => {
        it('should throw an error if role is not manager', async () => {
            const email = 'test@test.com';
            const role = 'employee';
            const ticketId = '123';
            const newStatus = 'approved';

            await expect(ManagerService.processTicketById(email, role, ticketId, newStatus)).rejects.toThrow('Employees can\'t access this route');
        });

        it('should throw an error if ticketId or email is missing', async () => {
            const email = '';
            const role = 'manager';
            const ticketId = '123';
            const newStatus = 'approved';

            await expect(ManagerService.processTicketById(email, role, ticketId, newStatus)).rejects.toThrow('TicketId/Email can\'t be empty');

            await expect(ManagerService.processTicketById('test@test.com', role, '', newStatus)).rejects.toThrow('TicketId/Email can\'t be empty');
        });

        it('should throw an error if ticket status is not pending', async () => {
            const email = 'test@test.com';
            const role = 'manager';
            const ticketId = '123';
            const newStatus = 'approved';
            const mockTicket = { status: 'approved' };

            getItem.mockResolvedValue(mockTicket);

            await expect(ManagerService.processTicketById(email, role, ticketId, newStatus)).rejects.toThrow('Already processed tickets can\'t be changed');
            expect(getItem).toHaveBeenCalledWith(email, ticketId);
        });

        it('should update the ticket if status is pending', async () => {
            const email = 'test@test.com';
            const role = 'manager';
            const ticketId = '123';
            const newStatus = 'approved';
            const mockTicket = { status: 'pending' };

            getItem.mockResolvedValue(mockTicket);
            updateItemById.mockResolvedValue({ ticketId, status: newStatus });

            const result = await ManagerService.processTicketById(email, role, ticketId, newStatus);

            expect(getItem).toHaveBeenCalledWith(email, ticketId);
            expect(updateItemById).toHaveBeenCalledWith(email, ticketId, newStatus);
            expect(result).toEqual({ ticketId, status: newStatus });
        });
    });
});
