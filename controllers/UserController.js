const userService = require("../services/userService")


async function registerUser(req, res) {

    try {



        const newUser = await userService.register(req.body);


        res.status(201).json(newUser);
    }

    catch (error) {
        let errorMessage;
        try {
            errorMessage = JSON.parse(error.message);
        } catch (parseError) {
            errorMessage = error.message;
        }
        res.status(400).json({ errors: errorMessage });
    }


}


async function loginUser(req, res) {
    try {
        const loginUser = await userService.login(req.body);
        res.status(200).json({ data: loginUser, sucess: true });

    } catch (error) {
        let errorMessage;
        console.log("Error", error)
        errorMessage = JSON.parse(error.message);

        res.status(400).json({ errors: errorMessage });
    }
}


module.exports = { registerUser, loginUser }