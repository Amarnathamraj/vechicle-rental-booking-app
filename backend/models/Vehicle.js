const { DataTypes }=require('sequelize');
const sequelize = require('../config/db');
const VehicleType = require('./VehicleType');
const Vehicle = sequelize.define('Vehicle', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
      name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
      vehicleTypeId:{
        type:DataTypes.INTEGER,
        references:{
            model:VehicleType, 
            key:'id',         
        },
    },
});


VehicleType.hasMany(Vehicle);
Vehicle.belongsTo(VehicleType);


module.exports = Vehicle;