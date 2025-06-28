
const express=require('express');
const cors=require('cors');
const sequelize=require('./config/db');
const VehicleType=require('./models/VehicleType');
const Vehicle=require('./models/Vehicle');
const Booking=require('./models/Booking');
const app=express();

app.use(express.json());
app.use(cors())

// sequelize.sync().then(() => {
//     console.log('Database connected');
// });
sequelize.authenticate()
  .then(() => {
    console.log('my sql workbech Database connected');
  })
  .catch((err) => {
    console.error('unable to connect to database:', err);
  });



app.get('/api/vehicle-types/:wheels',(req, res)=>{
    const wheels = req.params.wheels;
  VehicleType.findAll({
        where: { wheels: wheels }
    })
    //select *from vehicletypes where whels=2
    .then((vehicleTypes)=>{ 
        res.json(vehicleTypes);
    })
    .catch(()=>{
        res.status(500).json({ error:'failed to load vehicle types' });
    });
});
app.get('/api/vehicles/:typeId',(req, res)=>{
  const typeId = req.params.typeId;
  Vehicle.findAll({
        where: { vehicleTypeId: typeId }
    })
    //select *from vehicles where vehiletypid=3
.then((vehicles) => {
        res.json(vehicles);
 })
.catch(() => {
        res.status(500).json({ error:'failed to load vehicles' });
    });
});


app.post('/api/bookings',(req, res)=>{
     const { firstName,lastName,vehicleId,startDate,endDate }=req.body;
if (!firstName||!lastName||!vehicleId||!startDate||!endDate) {
        res.status(400).json({ error:'please enter all fields'});
      return;
    }
 const newStartDate=new Date(startDate);
 const newEndDate=new Date(endDate);
if (newEndDate <= newStartDate) {
 res.status(400).json({ error: 'End date must be after start date'});
  return;
    }

    Booking.findAll({
        where: { vehicleId: vehicleId },
         include: [{ model: Vehicle, attributes: ['name'] }]
    })
// slect bookings.*, Vehicles.name FROM  bookings iNNER JOIN 
//  Vehicles on Bookings.vehicleId = Vehicles.id where   bookings.vehicleId = 5;

    .then((bookings) => {
     console.log(JSON.stringify(bookings)); 
        for (let booking of bookings) {
          const existingStartDate = new Date(booking.startDate);
          const existingEndDate = new Date(booking.endDate);

            if (
                (newStartDate>=existingStartDate&&newStartDate<=existingEndDate) ||
                (newEndDate>= existingStartDate&&newEndDate <= existingEndDate) ||
                (newStartDate<=existingStartDate&&newEndDate >= existingEndDate)
            ) 
     {
            res.status(400).json({error:'vehicle is already booked for the dates' });
                return;
       }
        }

        Booking.create({
          firstName:firstName,
        lastName:lastName,
        vehicleId:vehicleId,
         startDate:newStartDate,
            endDate:newEndDate,
        })
        .then((booking) => {
           res.status(201).json(booking);
        })
        .catch(() => {
            res.status(500).json({ error:'failed to save booking' });
        });
    })
    .catch(() => {
        res.status(500).json({ error:'failed to check bookings' });
    });
});

app.get('/api/bookings',(req, res)=>{
    Booking.findAll({
        include:[{model:Vehicle, attributes: ['name'] }],
        attributes: ['firstName','lastName','startDate','endDate']
    })  .then((bookings) => {
      res.json(bookings);
    })
    .catch(() => {
        res.status(500).json({ error:'failed to load bookings' });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log('server running on port' + PORT);
});