const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {

    console.log(req.headers.authorization)
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            const token = req.headers.authorization.split(" ")[1];

            const verifyUser = jwt.verify(token, process.env.JWT_SECRET)
            const id = verifyUser.id

            console.log("Search user", verifyUser)
            const userDetail = await User.findByPk(id)

            req.user = userDetail.dataValues; //req.user contail all login user detail

            next();
        }
        else {
            alert("Failed to access user")
            res.redirect("/login");
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: 'Token expired or invalid', error: error.message });
    }
};

module.exports = auth;



