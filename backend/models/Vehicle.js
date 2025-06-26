
const { DataTypes } = require('sequelize');

const sequelize = require('../db');

const VehicleType = require('./VehicleType');


const Vehicle = sequelize.define('Vehicle', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
   
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    vehicleTypeId: {
        type: DataTypes.INTEGER,
        references: {
            model: VehicleType, 
            key: 'id',         
        },
    },
});

// Link VehicleType to many Vehicles
VehicleType.hasMany(Vehicle);
Vehicle.belongsTo(VehicleType);

// Export the model
module.exports = Vehicle;