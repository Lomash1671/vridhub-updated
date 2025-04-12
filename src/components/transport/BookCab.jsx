import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import supabase from '../../../supabase'; // Import Supabase client
import { Helmet } from 'react-helmet';

const BookCab = () => {
  const [contrast, setContrast] = useState(false);
  const [largerText, setLargerText] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Can be 'success' or 'error'

  const toggleContrast = () => setContrast(!contrast);
  const toggleLargerText = () => setLargerText(!largerText);

  const handleBooking = async (event) => {
    event.preventDefault();
  
    const form = event.target;
    const pickup = form.cabPickup.value;
    const dropoff = form.cabDropoff.value;
    const date = form.cabDate.value;
    const time = form.cabTime.value;
  
    if (pickup && dropoff && date && time) {
      const { data, error } = await supabase
        .from('Booking')
        .insert([
          {
            Pickuplocation: pickup,
            Dropofflocation: dropoff,
            Traveldate: date,
            Prefertime: time,
          },
        ]);
  
      if (error) {
        setMessage(`Error: ${error.message}`);
        setSnackbarSeverity('error'); // Set Snackbar severity to error
        setSnackbarOpen(true); // Open the Snackbar
      } else {
        setMessage(`Cab booked from ${pickup} to ${dropoff} on ${date} at ${time}.`);
        setSnackbarSeverity('success'); // Set Snackbar severity to success
        setSnackbarOpen(true); // Open the Snackbar
        setTimeout(() => {
          form.reset(); // Reset the form fields
          setMessage(''); // Clear the message after resetting
        }, 5000); // Reset after 5 seconds
      }
    } else {
      setMessage('Please fill in all fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Open the Snackbar with an error
    }
  };

  const displayAlert = () => {
    setMessage('This feature is not available yet.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Styling
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    color: '#333',
    margin: 0,
    padding: 0,
    fontSize: largerText ? '22px' : '18px',
  };

  const headerStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    fontSize: '30px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const navStyle = {
    backgroundColor: '#333',
    padding: '10px',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const navLinkStyle = {
    color: 'white',
    fontSize: '18px',
    textDecoration: 'none',
    margin: '0 15px',
    padding: '8px 12px',
    borderRadius: '5px',
  };

  const sectionStyle = {
    backgroundColor: 'white',
    margin: '20px 0',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const inputStyle = {
    fontSize: '14px', // Smaller font size
    padding: '10px',
    width: '100%',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '14px', // Smaller font size
    border: 'none',
    padding: '10px 15px', // Smaller padding
    margin: '10px 0', // Space between buttons
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  };

  const footerStyle = {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#333',
    color: 'white',
    marginTop: '30px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  };

  return (
    <>
    <Helmet>
      <title>Transport - Book Cab</title>
    </Helmet>
    <div
      style={{
        ...containerStyle,
        ...(contrast ? { backgroundColor: 'black', color: 'yellow' } : {}),
      }}
    >
      <header style={headerStyle}>
        Elderly-Friendly Transport Booking
      </header>

      <nav style={navStyle}>
        <a href="#book-cab" style={navLinkStyle}>Book Cab</a>
        <a onClick={displayAlert} href="#" style={navLinkStyle}>Book Bus</a>
        <a onClick={displayAlert} href="#" style={navLinkStyle}>Book Train</a>
      </nav>

      <main style={{ padding: '20px' }}>
        <div style={buttonContainerStyle}>
          <button
            className="btn btn-primary"
            style={buttonStyle}
            onClick={toggleContrast}
          >
            Toggle High Contrast
          </button>
          <button
            className="btn btn-primary"
            style={buttonStyle}
            onClick={toggleLargerText}
          >
            Larger Text
          </button>
          <button
            className="btn btn-primary"
            style={{ ...buttonStyle, backgroundColor: '#FF9800' }}
            onClick={displayAlert}
          >
            Read Aloud
          </button>
        </div>

        <section id="book-cab" style={sectionStyle}>
          <h2 style={{ color: '#4CAF50' }}>Book a Cab</h2>
          <form onSubmit={handleBooking}>
            <div className="mb-3">
              <label htmlFor="cabPickup">Pickup Location:</label>
              <input
                type="text"
                id="cabPickup"
                name="cabPickup"
                placeholder="Enter Pickup Location"
                style={inputStyle}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cabDropoff">Dropoff Location:</label>
              <input
                type="text"
                id="cabDropoff"
                name="cabDropoff"
                placeholder="Enter Dropoff Location"
                style={inputStyle}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cabDate">Travel Date:</label>
              <input
                type="date"
                id="cabDate"
                name="cabDate"
                style={inputStyle}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cabTime">Preferred Time:</label>
              <input
                type="time"
                id="cabTime"
                name="cabTime"
                style={inputStyle}
                required
              />
            </div>
            <input
              type="submit"
              value="Book Now"
              className="btn btn-primary"
              style={buttonStyle}
            />
          </form>
        </section>
      </main>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
    </>
  );
};

export default BookCab;
