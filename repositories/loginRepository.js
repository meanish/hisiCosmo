const User = require("../models/userModel");


module.exports = {
    store: async (userData) => {
        try {
            // Create a new user in the database
            const user = await User.findOne({ where: { email: userData.email } });
            return user


        }

        catch (err) {
            throw new Error('Failed to login in user: ' + err.message);
        }
    }
};
