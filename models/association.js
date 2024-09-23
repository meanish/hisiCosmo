const Category = require("./categoryModel");
const Media = require("./mediaModel");
const Product = require("./productsModel");
const Brand = require("./brandModel");
const Cart = require("./cartsModel");
const CartItem = require("./cartitemsModel");
const User = require("./userModel");
const Shipping = require("./shippingModel");
const OrderProducts = require("./orderProductModel");
const Order = require("./ordersModel");
const Transaction = require("./transactionModel");
const Purchase = require("./purchaseModel");


// Define associations
Product.hasMany(Media, {
    onDelete: 'CASCADE',
    foreignKey: 'mediaableId',
    constraints: false,
    scope: {
        mediaableType: 'product',
    },
    as: 'productmedia',
});

Media.belongsTo(Product, {
    foreignKey: 'mediaableId',
    constraints: false,
    as: 'Productmediaable',
});

// Product.belongsToMany(Category, { through: 'ProductCategories', as: 'categories' });
// Category.belongsToMany(Product, { through: 'ProductCategories', as: 'products' });


// Product.belongsToMany(Category, { through: ProductCategories, foreignKey: 'product_id', as: 'categories' });
// Category.belongsToMany(Product, { through: ProductCategories, foreignKey: 'category_id', as: 'products' });


Product.belongsToMany(Category, {
    through: 'ProductCategories', // The junction table
    foreignKey: 'product_id',
    otherKey: 'category_id',
    as: 'categories' // Alias for the related categories
});


Category.belongsToMany(Product, {
    through: 'ProductCategories',
    foreignKey: 'category_id',
    otherKey: 'product_id',
    as: 'products' // Alias for the related products
});


// ProductCategories.belongsTo(Product, {
//     foreignKey: 'product_id',
//     as: 'product',
//     constraints: true,
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//     foreignKeyConstraintName: 'custom_fk_product'
// });

// ProductCategories.belongsTo(Category, {
//     foreignKey: 'category_id',
//     as: 'category',
//     constraints: true,
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//     foreignKeyConstraintName: 'custom_fk_category'
// });




// Define one-to-many relationship between Brand and Product
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });


CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
});

CartItem.belongsTo(Cart, {
    foreignKey: 'cart_id',
    as: 'cart',
});


Shipping.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// ..................................payemnt associations ...........................

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });


Order.hasOne(Transaction, { foreignKey: 'order_id', as: "order_data" });
Transaction.belongsTo(Order, { foreignKey: 'order_id', as: "order_data" });

Order.hasMany(Purchase, { foreignKey: 'order_id' });
Purchase.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(Purchase, { foreignKey: 'product_id' });
Purchase.belongsTo(Product, { foreignKey: 'product_id' });


Order.belongsToMany(Product, { through: OrderProducts, foreignKey: 'order_id' });
Product.belongsToMany(Order, { through: OrderProducts, foreignKey: 'product_id' });

Order.hasMany(OrderProducts, { foreignKey: 'order_id', as: "orderproducts" });
OrderProducts.belongsTo(Order, { foreignKey: 'order_id', as: "order" });

Product.hasMany(OrderProducts, { foreignKey: 'product_id', as: "orderproducts" });
OrderProducts.belongsTo(Product, { foreignKey: 'product_id', as: "product" });


// ..................................payemnt associations ending ...........................



module.exports = {
    Product,
    Category,
    Media,
    Brand,
    CartItem,
    Shipping,
    Order,
    Transaction,
    Purchase,
    OrderProducts

};
