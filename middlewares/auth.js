const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
    // const parsedUrl = url.parse(req.url).pathname;

    // console.log("backend", parsedUrl);

    // if (parsedUrl === "/chat") {
    //     return next();
    // }

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
            res.redirect("/login");
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: 'Token expired or invalid', error: error.message });
    }
};

module.exports = auth;



