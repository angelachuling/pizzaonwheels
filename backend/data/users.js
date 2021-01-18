import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Anna',
        email: 'anna@example.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Lisa',
        email: 'lisa@example.com',
        password: bcrypt.hashSync('123456', 10)
    }
];

export default users;