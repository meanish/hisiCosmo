const { DataTypes } = require('sequelize');
const sequelize = require('../database/conn');

const Shipping = sequelize.define('Shipping', {


    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    {
        tableName: 'shipping',
        timestamps: false,
        underscored: true,
    }
);


sequelize.sync().then(() => {
    sequelize.sync()
        .then(() => {
            console.log("Shipping table synchronized successfully.");
        })
        .catch((error) => {
            console.error('Unable to synchronize the shippiing table:', error);
        });
})



module.exports = Shipping;

