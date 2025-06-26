// create the VehicleTypes table in MySQL in my system
module.exports = {
    up: (queryInterface, Sequelize) => {
      
        return queryInterface.createTable('VehicleTypes', {
      
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
         
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
           
            wheels: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
          
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
       
        return queryInterface.dropTable('VehicleTypes');
    },
};
//const { DataTypes } = require('sequelize');
// or 
// Sequelize.STRING
//same