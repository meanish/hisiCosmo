const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const adminAuth = async (req, res, next) => {

    console.log(req.headers.authorization)
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            const token = req.headers.authorization.split(" ")[1];

            const verifyUser = jwt.verify(token, process.env.JWT_SECRET)
            const id = verifyUser.id
            const userDetail = await User.findByPk(id)

            if (userDetail) {
                console.log("*********************Usr details", userDetail?.dataValues.role)
                const isAdmin = userDetail?.dataValues.role === "admin"
                if (isAdmin) {
                    req.user = userDetail.dataValues;
                }
                else {
                    return res.status(403).json({ message: 'Only Admin have the access' });
                }
            }

            next();
        }
        else {
            alert("Failed to access admin")

        }

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: 'Token expired or invalid', error: error.message });
    }
};

module.exports = adminAuth;



