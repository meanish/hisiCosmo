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



module.exports = { registerUser }