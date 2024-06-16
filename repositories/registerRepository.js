const User = require('../models/userModel'); // Assuming you have a User model defined in your models directory



module.exports = {
    create: async (userData) => {
        try {

            const isExisted = await User.findOne({ where: { email: userData.email } });

            if (isExisted) {
                throw new Error(JSON.stringify({ email: ["Email already registered!"] }))
            }
            
            // Create a new user in the database
            const newUser = await User.create(userData);
            return newUser;

        } catch (error) {
            // Handle any errors that occur during user creation
            throw new Error(error.message);
        }
    }
};
