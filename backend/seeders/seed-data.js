// add initial data to the database-mysql
module.exports = {
    up: (queryInterface, Sequelize) => {
        // insert 4 vehicle types to the tabkr
        return queryInterface.bulkInsert('VehicleTypes', [
            // Each object is a row in the VehicleTypes table
            { id: 1, name: 'Hatchback', wheels: 4, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, name: 'SUV', wheels: 4, createdAt: new Date(), updatedAt: new Date() },
            { id: 3, name: 'Sedan', wheels: 4, createdAt: new Date(), updatedAt: new Date() },
            { id: 4, name: 'Cruiser', wheels: 2, createdAt: new Date(), updatedAt: new Date() },
            { id: 5, name: 'Sports', wheels: 2, createdAt: new Date(), updatedAt: new Date() }, 
        ])
        .then(() => {
            // innsert  vehicles after vehicle types
            return queryInterface.bulkInsert('Vehicles', [
                { id: 1, name: 'Honda City', vehicleTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, name: 'Toyota Corolla', vehicleTypeId: 1, createdAt: new Date(), updatedAt: new Date() },
                { id: 3, name: 'Hyundai Creta', vehicleTypeId: 2, createdAt: new Date(), updatedAt: new Date() },
                { id: 4, name: 'Kia Seltos', vehicleTypeId: 2, createdAt: new Date(), updatedAt: new Date() },
                { id: 5, name: 'Maruti Dzire', vehicleTypeId: 3, createdAt: new Date(), updatedAt: new Date() },
                { id: 6, name: 'Honda Civic', vehicleTypeId: 3, createdAt: new Date(), updatedAt: new Date() },
                { id:7, name: 'Royal Enfield Classic', vehicleTypeId: 4, createdAt: new Date(), updatedAt: new Date() },
                {id:8,name:'Harley-davidson',vehicleTypeId:4,createdAt:new Date(),updatedAt:new Date()},
                { id:9, name: 'Yamaha R15', vehicleTypeId: 5, createdAt: new Date(), updatedAt: new Date() },
                { id:10, name: 'TVS-Apache', vehicleTypeId: 5, createdAt: new Date(), updatedAt: new Date() }

            ]);
        });
    },
    down: async (queryInterface, Sequelize) => {
        // First delete from bookings to avoid foreign key constraint errors
        await queryInterface.bulkDelete('Bookings', null, {}); // ✅ Step 1
        await queryInterface.bulkDelete('Vehicles', null, {}); // ✅ Step 2
        await queryInterface.bulkDelete('VehicleTypes', null, {}); // ✅ Step 3
      }
      
};