const express = require("express");
const router = express.Router();
const cors = require('cors');

require('dotenv').config() //required to use env
const PORT = process.env.PORT || 8000;

const app = express();
const LoginRouter = require("./routes/LoginRouter")
const ProductRouter = require("./routes/ProductRouter")
const ImageUploadRouter = require("./routes/imageUploadRoutes")
const BrandRouter = require("./routes/BrandRouter")
const StatusController = require("./controllers/StatusController")
const categoriesRouter = require("./routes/categoriesRoutes")
const filterController = require("./controllers/FilterControllers")
const CartRouter = require("./routes/CartRouter")
const ShippingRouter = require("./routes/shippingRouter")
const OrderRouter = require("./routes/OrderRoutes")
const TransactionRouter = require("./routes/TransactionRouter")
const PurchaseRouter = require("./routes/PurchaseRoutes")


const authRoutes = require("./routes/authRoutes");
require("./database/conn")
const path = require('path');
const sequelize = require("./database/conn");





app.use(express.json()); //if we get json as req then it accepts
app.use(express.urlencoded({ extended: false })); //not only postman in live server too return json handles
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use("/auth", authRoutes)

app.use("/category", categoriesRouter)

app.use("/product", ProductRouter)

console.log("pathname", __dirname)

app.use("/upload_image", ImageUploadRouter)

app.use("/brand", BrandRouter)


app.use("/cart", CartRouter)


app.use("/shipping", ShippingRouter)



router.get("/", (req, res) => {
    res.send("Home Page Here")
});


app.get("/filters", filterController.filterProduct)



/* auth include login , register, logout */
app.use("/auth", authRoutes)



app.use("/login", LoginRouter)


app.use("/order", OrderRouter)
app.use("/transaction", TransactionRouter)
app.use("/purchase", PurchaseRouter)


app.get("/status", StatusController.getAllStatus)
app.get("/discountstatus", StatusController.getDiscountStatus)
app.get("/transstatus", StatusController.getTransacStatus)
app.get("/orderstatus", StatusController.getOrderStatus)
app.get("/purchasestatus", StatusController.getPurchaseStatus)
app.get("/paymenttype", StatusController.getPaymentStatus)

// ..................DEPLOYEMENT......................


const startServer = async () => {
    try {
        await sequelize.sync({ force: false }); // Use force: true only for development, as it will drop tables
        console.log('Database synchronized successfully.');

        app.listen(PORT, "127.0.0.1", () => {
            console.log('Server listening on port ' + PORT);
        });


    } catch (error) {
        console.error('Unable to synchronize the database:', error);
    }
};

startServer();

