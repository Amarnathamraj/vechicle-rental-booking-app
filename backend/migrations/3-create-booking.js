// Create the Bookings table
module.exports={
    up: (queryInterface,Sequelize)=>{
        return queryInterface.createTable('Bookings',{
            id:{
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,
                type: Sequelize.INTEGER,
            },
            firstName:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            lastName:{
                type: Sequelize.STRING,
                allowNull: false,
            },
            vehicleId:{
                type:Sequelize.INTEGER,
                references:{
                    model: 'Vehicles',
                    key: 'id',
                },
            },
            startDate:{
                type: Sequelize.DATE,
                allowNull: false,
            },
            endDate:{
                type: Sequelize.DATE,
                allowNull: false,
            },
            createdAt:{
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt:{
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down:(queryInterface, Sequelize)=>{
        return queryInterface.dropTable('Bookings');
    },
};