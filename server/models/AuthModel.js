const User = require('../models/User');
const bcrypt = require('bcrypt');

async function login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.password) {
        throw new Error("You probably logged in via LinkedIn, so no password is set");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    return user;
}

async function register(full_name, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [firstName, ...lastNameParts] = full_name.split(" ");
    const lastName = lastNameParts.join(" ");

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });


     
    await newUser.save();
    return newUser;
}


async function getMe(userId){
    const user= await User.findById(userId);
     if (!user) throw new Error("user not found");

  return user;
}

module.exports = { login, register , getMe };
