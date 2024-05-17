const User = require('../models/userModel');



const register = async ({ formData }) => {

    try {

        const { username, password, email } = formData;

        const newUser = new User({
            username,
            password,
            email
        });


        const savedUser = await newUser.save();

        return { success: true, message: 'User registered successfully', user: savedUser };

    } catch (error) {
        return { success: false, message: error.message };
    }
}


const login = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }


        if (password === user.password) {
            return { success: true, message: 'Login successful', user };
        } else {
            throw new Error('Incorrect password');
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const logout = async (userId) => {
    // Implementation of logout logic
};

module.exports = {
    login,
    logout,
    register
};