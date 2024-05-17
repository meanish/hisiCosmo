const User = require('../models/userModel'); // Assuming you have a User model defined in your models directory

module.exports = {
    create: async (userData) => {
        try {
            // Create a new user in the database
            const newUser = await User.create(userData);
            return newUser;
            
        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error('Failed to create user: ' + error.message);
        }
    }
};
