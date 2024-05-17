const jwt = require("jsonwebtoken");
const url = require("url");

// const auth = async (req, res, next) => {
//     const parsedUrl = url.parse(req.url).pathname;

//     console.log("backend", parsedUrl);

//     if (parsedUrl === "/chat") {
//         return next();
//     }

//     try {
//         if (
//             req.headers.authorization &&
//             req.headers.authorization.startsWith("Bearer")
//         ) {
//             const token = req.headers.authorization.split(" ")[1];

//             const verifyUser = jwt.verify(token, process.env.JWT_keyName)

//             const userDetail = await userOriginal
//                 .findById(verifyUser._id)
//                 .select("-password");

//             req.user = userDetail; //req.user contail all login user detail

//             next();
//         }
//         else {
//             res.redirect("/login");
//         }
//     } catch (error) {
//         console.error("Authentication error:", error);
//         return res.status(401).json({ message: 'Token expired or invalid' });
//     }
// };

// module.exports = auth;



