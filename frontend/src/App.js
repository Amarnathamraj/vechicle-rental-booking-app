import './App.css';
import React, { useState } from 'react';
import SuccessAnimation from './SuccessAnimation';

import {
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const App = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    wheels: '',
    vehicleTypeId: '',
    vehicleId: '',
    dateRange: [null, null],
  });
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]); // New state for bookings
  const [error, setError] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);


  const validateStep = () => {
    if (step === 1 && (formData.firstName.trim() === '' || formData.lastName.trim() === '')) {
      return 'Please enter both first and last name';
    }
    if (step === 2 && formData.wheels === '') {
      return 'Please select the number of wheels';
    }
    if (step === 3 && formData.vehicleTypeId === '') {
      return 'Please select a vehicle type';
    }
    if (step === 4 && formData.vehicleId === '') {
      return 'Please select a vehicle model';
    }
    if (step === 5 && (formData.dateRange[0] === null || formData.dateRange[1] === null)) {
      return 'Please select a valid date range';
    }
    return '';
  };

  const fetchVehicleTypes = () => {
    fetch(`http://localhost:5000/api/vehicle-types/${formData.wheels}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setVehicleTypes(data);
        setStep(3);
      })
      .catch(() => {
        setError('Failed to load vehicle types');
      });
  };
  

  const fetchVehicles = () => {
    axios
      .get(`http://localhost:5000/api/vehicles/${formData.vehicleTypeId}`)
      .then((response) => {
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
        setError('Failed to load bookings');
      });
  };
  
  const submitBooking = () => {
    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        vehicleId: formData.vehicleId,
        startDate: formData.dateRange[0],
        endDate: formData.dateRange[1],
      }),
    })
      .then((response) => response.json().then((data) => {
        if (!response.ok) {
          setError(data.error || 'Booking failed');
          return;
        }
  
        // Show animation
        setShowAnimation(true);
  
        setTimeout(() => {
          setShowAnimation(false);
          setFormData({
            firstName: '',
            lastName: '',
            wheels: '',
            vehicleTypeId: '',
            vehicleId: '',
            dateRange: [null, null],
          });
          setVehicleTypes([]);
          setVehicles([]);
          fetchBookings();
        }, 4500);
      }))
      .catch(() => {
        setError('Booking failed due to network error');
      });
  };
  
  
  

  const handleNext = () => {
    const errorMessage = validateStep();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError('');

    if (step === 2) {
      fetchVehicleTypes();
      return;
    }

    if (step === 3) {
      fetchVehicles();
      return;
    }

    if (step === 5) {
      submitBooking();
      return;
    }

    setStep(step + 1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {showAnimation && <SuccessAnimation wheels={formData.wheels} />}

        <Card elevation={3}>
          <CardContent>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" align="center" gutterBottom>
                Step {step} of 6
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
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

              {step === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Number of Wheels
                  </Typography>
                  <FormControl fullWidth>
                    <FormLabel>Choose an option</FormLabel>
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

              {step === 3 && (
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

              {step === 4 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Specific Model
                  </Typography>
                  <FormControl fullWidth>
                    <FormLabel>Select a model</FormLabel>
                    <RadioGroup
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: Number(e.target.value) })}
                    >
                      {vehicles.map((vehicle) => (
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

              {step === 5 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Select Date Range
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker
                      label="Start Date"
                      value={formData.dateRange[0]}
                      onChange={(newDate) =>
                        setFormData({
                          ...formData,
                          dateRange: [newDate, formData.dateRange[1]],
                        })
                      }
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <DatePicker
                      label="End Date"
                      value={formData.dateRange[1]}
                      onChange={(newDate) =>
                        setFormData({
                          ...formData,
                          dateRange: [formData.dateRange[0], newDate],
                        })
                      }
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Box>
                </Box>
              )}

              {step === 6 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Your Bookings
                  </Typography>
                  {bookings.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Vehicle</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
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
                  ) : (
                    <Typography>No bookings found.</Typography>
                  )}
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                {step === 6 ? (
                 <Button
                 variant="contained"
                 color="primary"
                 onClick={() => {
                   setStep(1);
                   setBookings([]);
                 }}
                 sx={{
                   mt: 2,
                   width: '100%',
                   backgroundColor: '#A6A7A9',
                   color: 'black',
                   py: 1.5,
                   fontSize: '1rem',
                   fontWeight: 'bold',
                   '&:hover': {
                     backgroundColor: '#d5d5d5',
                   },
                 }}
               >
                 Start Over
               </Button>
               
                ) : (
                  <Button
  variant="contained"
  color="primary"
  onClick={handleNext}
  sx={{
    mt: 2,
    width: '100%',
    backgroundColor: '#A6A7A9',
    color: 'black',
    py: 1.5, // vertical padding increased
    fontSize: '1rem', 
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#d5d5d5',
    },
  }}
>
  {step === 5 ? 'Submit' : 'Next'}
</Button>

                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </LocalizationProvider>
  );
};

export default App;