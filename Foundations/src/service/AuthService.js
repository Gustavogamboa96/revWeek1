const {findByEmail, addUser} = require("../repository/UsersDAO");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const JWT_SECRET = process.env.JWT_SECRET;
 
async function login(email, password) {
    const user = await findByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }
    // console.log(`${user.email} ${user.password}`)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ email: user.email, role: user.role}, JWT_SECRET, { expiresIn: '1h' });
    return token;
}

async function register(email, password, role) {
    if(!email || !password){
        throw new Error('Email/Password must not be empty');
    }
    if(!role){
        role = "employee";
    } 
    const userExists = await findByEmail(email);
    if(userExists){
        throw new Error('User already exists');
    }
    password = await bcrypt.hash(password, saltRounds);
    
    const user = {email, password, role};
    const data = await addUser(user);

    return data;
    
}

module.exports={login, register};