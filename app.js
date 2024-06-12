const express = require("express");
const router = express.Router();
const cors = require('cors');

require('dotenv').config() //required to use env
const PORT = process.env.PORT || 8000;

const app = express();


const LoginRouter = require("./routes/LoginRouter")
const RegisterRouter = require("./routes/RegisterRouter")
const ProductRouter = require("./routes/ProductRouter")
const ImageUploadRouter = require("./routes/imageUploadRoutes")
const BrandRouter = require("./routes/BrandRouter")

const categoriesRouter = require("./routes/categoriesRoutes")

const authRoutes = require("./routes/authRoutes");
const Product = require("./models/productsModel");
const Category = require("./models/categoryModel");
require("./database/conn")
const path = require('path');



app.use(express.json()); //if we get json as req then it accepts
app.use(express.urlencoded({ extended: false })); //not only postman in live server too return json handles
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));







app.use("/auth", authRoutes)

app.use("/categories", categoriesRouter)

app.use("/products", ProductRouter)

console.log("pathname", __dirname)

app.use("/upload_image", ImageUploadRouter)

app.use("/brand", BrandRouter)

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


