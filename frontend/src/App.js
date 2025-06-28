import './App.css';
import React, { useState } from 'react';


import {
Container,Card,CardContent,Button,TextField,Radio,RadioGroup,FormControlLabel,
FormControl,FormLabel,Typography,Alert,Box,Table,TableBody,TableCell,TableContainer,
TableHead,TableRow,Paper} from '@mui/material';

import axios from 'axios';

const App=() => {
  const [step,setStep]=useState(1);
  const [formData,setFormData]=useState({
    firstName:'',
    lastName:'',
    wheels:'',
    vehicleTypeId:'',
    vehicleId:'',
    dateRange:[null,null],
  });
const [vehicleTypes,setVehicleTypes] = useState([]);
const [vehicles,setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]); 
  const [error,setError] = useState('');
  


  const validateStep = () => {
  if (step===1&&(formData.firstName.trim()==='' || formData.lastName.trim() === '')) {
      return ' enter both first and last name';
    }
    if (step===2 && formData.wheels === '') {
      return ' select the number of wheels';
    }
    if (step===3 && formData.vehicleTypeId === '') {
      return ' select a vehicle type';
    }
    if (step=== 4 && formData.vehicleId === '') {
      return ' select avehicle model';
    }
    if (step === 5 && (formData.dateRange[0] === null || formData.dateRange[1] === null)) {
      return ' select a valid data range';
    }
    return '';
  };

  const fetchVehicleTypes=() => {
    fetch(`http://localhost:5000/api/vehicle-types/${formData.wheels}`)
      .then((res)=>res.json())
      .then((data)=> {
        console.log(data)
        setVehicleTypes(data);
        setStep(3);
      })
      .catch(()=> {
        setError('failed to load vehicle types');
      });
  };
  

  const fetchVehicles = () => {
    axios
      .get(`http://localhost:5000/api/vehicles/${formData.vehicleTypeId}`)
      .then((response)=>{
        console.log(response)
        
        setVehicles(response.data);
      
        setStep(4);
      })
      .catch(() => {
        setError('Failed to load vehicles');
      });
  };

  const fetchBookings = () => {
    fetch('http://localhost:5000/api/bookings')
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
        setStep(6);
      })
      .catch(() => {
        setError('failed to load bookings');
      });
  };
  
  const submitBooking = () => {
    fetch('http://localhost:5000/api/bookings',{
      method:'POST',
    headers:{'Content-Type':'application/json' },
   body: JSON.stringify({
       firstName:formData.firstName,
      lastName:formData.lastName,
        vehicleId:formData.vehicleId,
        startDate:formData.dateRange[0],
        endDate:formData.dateRange[1],
      }),
    })
    .then((response) => response.json().then((data)=>{
       if(!response.ok){
          setError(data.error||'booking failed');
          return;
        }

       setFormData({
          firstName:'',
            lastName:'',
          wheels:'',
            vehicleTypeId:'',
            vehicleId:'',
            dateRange: [null, null],
          });
          setVehicleTypes([]);
          setVehicles([]);
          fetchBookings();
      }))
      .catch(()=>{
        setError('booking is failed');
      });
  };
  
  const handleNext=()=>{
    const errorMessage=validateStep();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError('');

    if (step===2) {
      fetchVehicleTypes();
      return;
    }

    if (step===3) {
      fetchVehicles();
      return;
    }
    if (step===5) {
      submitBooking();
      return;
    }
    setStep(step+1);
  };

  return (
    <div
    style={{
      backgroundImage:'url("/background.png")',
      backgroundSize:'cover',
      backgroundRepeat:'no-repeat',
      backgroundPosition:'center',
     minHeight:'100vh',
      overflow:'hidden',                   
      padding:'0',
      margin:'0',
    }}
  >
  
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
   
      <Typography
  variant="h5"
  align="center"
  gutterBottom
  sx={{
    fontWeight:400,
    color:'#333',
    backgroundColor: '#f5f5f5',
    padding:'12px 24px',
    borderRadius:'12px',
    boxShadow:'0 2px 6px rgba(0,0,0,0.5)',
    mb: 3,
  }}
>
  Book Your Vehicle
</Typography>
 <Card elevation={3}>
    <CardContent>
   <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" align="center" gutterBottom>
      Step {step} of 6
      </Typography>

       {error && (
          <Alert severity="error" sx={{mb:2 }}>
                {error}
                </Alert>
              )}

        {step === 1 && (
           <Box>
  <Typography variant="h6" gutterBottom>
       What is your name?
     </Typography>
         <TextField
         label="First Name"
             value={formData.firstName}
       onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          fullWidth
                 margin="normal"
                  />
        <TextField
           label="Last Name"
           value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            fullWidth
            margin="normal"
                  />
                </Box>
              )}

              {step===2&&(
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Number of Wheels
                  </Typography>
                  <FormControl fullWidth>
                    <FormLabel>choose an option</FormLabel>
                    <RadioGroup
                      value={formData.wheels}
                      onChange={(e) => setFormData({ ...formData, wheels: e.target.value })}
                    >
                      <FormControlLabel value="2" control={<Radio />} label="2 Wheeler" />
                      <FormControlLabel value="4" control={<Radio />} label="4 Wheeler" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              {step===3&&(
                <Box>
              <Typography variant="h6" gutterBottom>
                Type of Vehicle
                  </Typography>
             <FormControl fullWidth>
                <FormLabel>Select a vehicle type</FormLabel>
                 <RadioGroup
                     value={formData.vehicleTypeId}
                 onChange={(e) =>
                  setFormData({ ...formData, vehicleTypeId: Number(e.target.value) })
                   }
                    >
                 {vehicleTypes.map((type) => (
           <FormControlLabel
          key={type.id}
           value={type.id}
         control={<Radio />}
         label={type.name}
                 />
                      ))}
             </RadioGroup>
           </FormControl>
                </Box>
              )}

              {step===4&&(
                <Box>
                  <Typography variant="h6" gutterBottom>
                    specific Model
                  </Typography>
                  <FormControl fullWidth>
                    <FormLabel>select a model</FormLabel>
                    <RadioGroup
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData,vehicleId:Number(e.target.value) })}
                    >
                 {vehicles.map((vehicle)=>(
                  <FormControlLabel
                     key={vehicle.id}
                      value={vehicle.id}
                    control={<Radio />}
                     label={vehicle.name}
                        />
                      ))}
                 </RadioGroup>
            </FormControl>
                </Box>
              )}

{step===5 && (
  <Box>
    <Typography variant="h6" gutterBottom>
      select start and end dates
    </Typography>
    <Box sx={{ display:'flex',gap: 2 }}>
      <TextField
        type="date"
        value={formData.dateRange[0]||''}
        onChange={(e) =>
          setFormData({
            ...formData,
            dateRange:[e.target.value, formData.dateRange[1]],
          })
        }
        fullWidth
      />
      <TextField
        type="date"
         value={formData.dateRange[1]||''}
        onChange={(e) =>
          setFormData({
            ...formData,
            dateRange: [formData.dateRange[0], e.target.value],
          })
        }
        fullWidth
      />
    </Box>
  </Box>
)}


     {step===6&&(
         <Box>
        <Typography variant="h6" gutterBottom>
                    Your bookings
                  </Typography>
                  {bookings.length>0?(
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>vehicle</TableCell>
                            <TableCell>start date</TableCell>
                            <TableCell>End date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>{`${booking.firstName} ${booking.lastName}`}</TableCell>
                              <TableCell>{booking.Vehicle.name}</TableCell>
                              <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ):(
                    <Typography>no bookings found</Typography>
                  )}
                </Box>
              )}

              <Box sx={{ mt: 3,display:'flex',justifyContent: 'flex-end' }}>
                {step===6?(
                 <Button
                 variant="contained"
                 color="primary"
                 onClick={() => {
                   setStep(1);
                   setBookings([]);
                 }}
                 sx={{
                   mt: 2,
                   width:'100%',
                   backgroundColor:'#A6A7A9',
                   color:'black',
                   py: 1.5,
                   fontSize:'1rem',
                   fontWeight:'bold',
                   '&:hover':{
                     backgroundColor: '#d5d5d5',
                   },
                 }}
               >
                 start Over
               </Button>
               
                ):(
                  <Button
  variant="contained"
  color="primary"
  onClick={handleNext}
  sx={{
    mt: 2,
    width:'100%',
    backgroundColor:'#A6A7A9',
    color:'black',
    py: 1.5,
    fontSize:'1rem', 
    fontWeight:'bold',
    '&:hover':{
      backgroundColor:'#d5d5d5',
    },
  }}
>
  {step===5?'Submit': 'Next'}
   </Button>
 )}
             </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

    </div>
  );
};

export default App;