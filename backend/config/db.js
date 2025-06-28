const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('vehicle_rental_db','root','Amraj@7674023233', {
host: 'localhost',
dialect: 'mysql',
});

module.exports = sequelize;