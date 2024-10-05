const bcrypt = require("bcryptjs");
const registerRepository = require("../repositories/registerRepository");
const { validateUserData } = require("../schemas/userSchema");
const { validateloginData } = require("../schemas/loginSchema");
const loginRepository = require("../repositories/loginRepository");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const mediaRepository = require("../repositories/mediaRepository");
const mediaTask = require("../helper/mediaTask");
const sequelize = require("../database/conn");
const imageConvert = require("../helper/imageSlashremoval");

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
    const newUser = await registerRepository.create({ ...userData, password: hashedPassword });
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

async function getmyData(id) {

    const mediaData = {
        mediaableId: id,
        mediaableType: 'profile',
    }
    let featured_image;
    try {
        const users = await userRepository.all();

        const findUsersData = async (id) => {
            const isAvailable = users.find(currUser => currUser.dataValues.id === +id);

            if (!isAvailable) {
                return null;
            }


            const featured_image_file = await mediaRepository.find(mediaData);

            if (featured_image_file) {

                let imgPath = featured_image_file ? imageConvert(featured_image_file.dataValues.filePath) : null
                featured_image = imgPath ? `${process.env.NEXT_PUBLIC_HISI_SERVER}/${imgPath}` : null;
            }
            else {
                featured_image = null
            }
            return {
                ...isAvailable.dataValues,
                featured_image: featured_image,
            };
        };

        const userData = await findUsersData(id);

        return { success: true, data: userData };

    } catch (error) {
        return { success: false, message: error.message };
    }
}

const updateUser = async ({ user_id, fields, file }) => {

    const transaction = await sequelize.transaction();
    let mediaType = "profile"

    try {
        let featured_image_path = await mediaTask(user_id, file, mediaType, fields, { transaction })

        const getuserResult = await userRepository.update(user_id, fields, { transaction });
        if (!getuserResult) {
            await transaction.rollback();
            return { success: false, message: "Something went wrong!" };
        }


        return {
            success: true,
            data: {
                ...getuserResult.dataValues, featured_image: `${featured_image_path}`
            }
        }


    } catch (error) {

        console.log("eroro in order servuides", error.message)
        return { success: false, message: error.message };
    }


}


async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}






module.exports = { register, login, getmyData, updateUser };
