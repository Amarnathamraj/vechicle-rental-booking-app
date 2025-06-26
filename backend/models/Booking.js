
const { DataTypes } = require('sequelize');

const sequelize = require('../db');

const Vehicle = require('./Vehicle');

const Booking = sequelize.define('Booking', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
   
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    vehicleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Vehicle, 
            key: 'id',
        },
    },
    
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
   
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});


Vehicle.hasMany(Booking);
Booking.belongsTo(Vehicle);


module.exports = Booking;