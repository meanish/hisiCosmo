const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/registerRepository");
const { validateUserData } = require("../schemas/userSchema");
const { validateloginData } = require("../schemas/loginSchema");
const loginRepository = require("../repositories/loginRepository");
const jwt = require("jsonwebtoken")

async function register(userData) {


    console.log("users", userData)
    // Validate user data
    const validationErrors = validateUserData(userData);
    if (validationErrors) {
        throw new Error(JSON.stringify(validationErrors));
    }


    // Hash the passwordplogi
    const hashedPassword = await hashPassword(userData.password);

    // Create new user
    const newUser = await userRepository.create({ ...userData, password: hashedPassword });
    return newUser;
}


async function login(userData) {

    const validationErrors = validateloginData(userData);
    if (validationErrors) {
        throw new Error(JSON.stringify(validationErrors));
    }

    const user = await loginRepository.store({ ...userData });

    console.log("what is in the autherization", user)

    if (!user) {
        throw new Error(JSON.stringify({ email: ["No user found"] }));
    }

    else {
        // Verify password
        const passwordValid = await bcrypt.compare(userData.password, user.password);


        if (!passwordValid) {
            throw new Error(JSON.stringify({ password: ["Password doesnot match"] }));

        }


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // console.log("Expires at", jwt_decode(token))


        return ({
            id: user.id,
            name: user.username,
            email: user.email,
            accessToken: token,
            role: user.role
        });


    }


}


async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}






module.exports = { register, login };
