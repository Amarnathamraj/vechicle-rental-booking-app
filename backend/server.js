
const express = require('express');

const sequelize = require('./config/db');


const VehicleType = require('./models/VehicleType');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');


const app = express();

app.use(express.json());


sequelize.sync().then(() => {
    console.log('Database connected');
});


app.get('/api/vehicle-types/:wheels', (req, res) => {
   
    const wheels = req.params.wheels;
  
    VehicleType.findAll({
        where: { wheels: wheels }
    })
    .then((vehicleTypes) => {
        
        res.json(vehicleTypes);
    })
    .catch(() => {
    
        res.status(500).json({ error: 'Failed to load vehicle types' });
    });
});


app.get('/api/vehicles/:typeId', (req, res) => {
 
    const typeId = req.params.typeId;
 
    Vehicle.findAll({
        where: { vehicleTypeId: typeId }
    })
    .then((vehicles) => {
        res.json(vehicles);
    })
    .catch(() => {
        res.status(500).json({ error: 'Failed to load vehicles' });
    });
});


app.post('/api/bookings', (req, res) => {
    
    const { firstName, lastName, vehicleId, startDate, endDate } = req.body;

  
    if (!firstName || !lastName || !vehicleId || !startDate || !endDate) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    
    if (newEndDate <= newStartDate) {
        res.status(400).json({ error: 'End date must be after start date'});
        return;
    }

    Booking.findAll({
        where: { vehicleId: vehicleId }
    })
    .then((bookings) => {
     
        for (let booking of bookings) {
          
            const existingStartDate = new Date(booking.startDate);
            const existingEndDate = new Date(booking.endDate);

            if (
                (newStartDate>=existingStartDate && newStartDate <= existingEndDate) ||
                (newEndDate>= existingStartDate && newEndDate <= existingEndDate) ||
                (newStartDate<= existingStartDate && newEndDate >= existingEndDate)
            ) {
                res.status(400).json({ error: 'Vehicle is already booked for these dates' });
                return;
            }
        }

        Booking.create({
            firstName: firstName,
            lastName: lastName,
            vehicleId: vehicleId,
            startDate: newStartDate,
            endDate: newEndDate,
        })
        .then((booking) => {
           
            res.status(201).json(booking);
        })
        .catch(() => {
            res.status(500).json({ error: 'Failed to save booking' });
        });
    })
    .catch(() => {
        res.status(500).json({ error: 'Failed to check bookings' });
    });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});