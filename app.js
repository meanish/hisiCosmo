const express = require("express");
const router = express.Router();
const cors = require('cors');

require('dotenv').config() //required to use env
const PORT = process.env.PORT || 8000;

const app = express();


const LoginRouter = require("./routes/LoginRouter")
const RegisterRouter = require("./routes/RegisterRouter")

const authRoutes = require("./routes/authRoutes")
require("./database/conn")




app.use(express.json()); //if we get json in return from file express handles in postman
app.use(express.urlencoded({ extended: false })); //not only postman in live server too return json handles
app.use(cors())




app.use("/auth", authRoutes)



router.get("/", (req, res) => {
    res.send("Home Page Here")
});


/* auth include login , register, logout */
app.use("/auth", authRoutes)



app.use("/login", LoginRouter)

// ..................DEPLOYEMENT......................

app.listen(PORT, "127.0.0.1", () => {
    console.log('Server listening on port ' + PORT);
});


