const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/registerRepository");
const { validateUserData } = require("../schemas/userSchema");

async function register(userData) {
    // Validate user data
    const validationErrors = validateUserData(userData);
    if (validationErrors) {
        throw new Error(JSON.stringify(validationErrors));
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create new user
    const newUser = await userRepository.create({ ...userData, password: hashedPassword });
    return newUser;
}



async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}



module.exports = { register };
