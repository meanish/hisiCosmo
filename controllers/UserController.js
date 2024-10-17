const userService = require("../services/userService")


async function registerUser(req, res) {

    try {

        const newUser = await userService.register(req.body);

        res.status(201).json({ data: newUser, success: true });

    }

    catch (error) {
        let errorMessage;
        try {
            errorMessage = JSON.parse(error.message);
        } catch (parseError) {
            errorMessage = error.message;
        }
        res.status(400).json({ errors: errorMessage, success: false });
    }


}


async function loginUser(req, res) {
    try {
        const loginUser = await userService.login(req.body);
        res.status(200).json({ data: loginUser, success: true });

    } catch (error) {
        let errorMessage;
        console.log("Error", error)
        errorMessage = JSON.parse(error.message);
        res.status(400).json({ errors: errorMessage, success: false });
    }
}

async function getData(req, res) {
    const user_id = req.user.id;

    try {
        const result = await userService.getmyData(user_id);
        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        }
        else res.status(500).json({ success: false, message: result?.message });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateUser = async (req, res) => {
    const fields = req.body
    const file = req.file
    const user_id = req.user.id;

    console.log("Fields", fields)

    try {
        const result = await userService.updateUser({ user_id, fields, file });
        if (result.success) {
            res.status(200).json({ data: result.data, success: true });
        }
        else res.status(500).json({ success: false, message: result?.message });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}





module.exports = { registerUser, loginUser, getData, updateUser }