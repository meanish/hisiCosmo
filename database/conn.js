const { Sequelize } = require('sequelize');
require('dotenv').config(); // Assuming you're using dotenv for managing environment variables

const sequelize = new Sequelize({
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    dialect: 'mysql', // Or any other supported database dialect
});


sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });


module.exports = sequelize;
 