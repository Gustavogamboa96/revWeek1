const { login, register } = require('../src/service/AuthService');
const { findByEmail, addUser } = require('../src/repository/UsersDAO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../src/repository/UsersDAO');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    describe('login', () => {
        it('should throw an error if user is not found', async () => {
            findByEmail.mockResolvedValue(null);

            await expect(login('test@example.com', 'password123')).rejects.toThrow('User not found');
        });

        it('should throw an error if the password is invalid', async () => {
            const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
            findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
        });

        it('should return a JWT token if login is successful', async () => {
            const mockUser = { email: 'test@example.com', password: 'hashedPassword', role: 'employee' };
            findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            const mockToken = 'mockJWTToken';
            jwt.sign.mockReturnValue(mockToken);

            const token = await login('test@example.com', 'password123');

            expect(token).toBe(mockToken);
            expect(jwt.sign).toHaveBeenCalledWith(
                { email: mockUser.email, role: mockUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
        });
    });

    describe('register', () => {
        it('should throw an error if email or password is empty', async () => {
            await expect(register('', 'password123')).rejects.toThrow('Email/Password must not be empty');
            await expect(register('test@example.com', '')).rejects.toThrow('Email/Password must not be empty');
        });

        it('should throw an error if the user already exists', async () => {
            findByEmail.mockResolvedValue({ email: 'test@example.com' });

            await expect(register('test@example.com', 'password123')).rejects.toThrow('User already exists');
        });

        it('should hash the password and save the user if registration is successful', async () => {
            findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            const mockUser = { email: 'test@example.com', password: 'hashedPassword', role: 'employee' };
            addUser.mockResolvedValue(mockUser);

            const result = await register('test@example.com', 'password123');

            expect(result).toEqual(mockUser);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(addUser).toHaveBeenCalledWith(mockUser);
        });

        it('should assign the default role of "employee" if role is not provided', async () => {
            findByEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            const mockUser = { email: 'test@example.com', password: 'hashedPassword', role: 'employee' };
            addUser.mockResolvedValue(mockUser);

            const result = await register('test@example.com', 'password123');

            expect(result.role).toBe('employee');
        });
    });
});
