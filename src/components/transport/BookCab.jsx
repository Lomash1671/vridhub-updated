import  { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import supabase from '../../../supabase'; // Import Supabase client
import { Helmet } from 'react-helmet';
import "../../styles/transport/BookCab.css"; // Import your CSS styles

const BookCab = () => {
  const [contrast, setContrast] = useState(false); // State for dark mode
  const [largerText, setLargerText] = useState(false); // State for larger text
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Can be 'success' or 'error'

  const toggleContrast = () => {
    setContrast(!contrast);
  };

  const toggleLargerText = () => {
    setLargerText(!largerText);
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    const form = event.target;
    const pickup = form.cabPickup.value;
    const dropoff = form.cabDropoff.value;
    const date = form.cabDate.value;
    const time = form.cabTime.value;

    if (pickup && dropoff && date && time) {
      const {  error } = await supabase
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
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setMessage(`Cab booked from ${pickup} to ${dropoff} on ${date} at ${time}.`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => {
          form.reset();
          setMessage('');
        }, 5000);
      }
    } else {
      setMessage('Please fill in all fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Transport - Book Cab</title>
      </Helmet>
      <div
        className={`${
          contrast ? 'dark-mode' : ''
        } ${largerText ? 'larger-text' : ''}`}
      >
        <header>
          Elderly-Friendly Transport Booking
        </header>

        <nav>
          <a href="#book-cab">Book Cab</a>
          <a href="#" onClick={() => alert('This feature is not available yet.')}>
            Book Bus
          </a>
          <a href="#" onClick={() => alert('This feature is not available yet.')}>
            Book Train
          </a>
        </nav>

        <main>
          <div className="button-container">
            <button onClick={toggleContrast}>
              Toggle High Contrast
            </button>
            <button onClick={toggleLargerText}>
              Toggle Larger Text
            </button>
          </div>

          <section id="book-cab">
            <h2>Book a Cab</h2>
            <form onSubmit={handleBooking}>
              <div>
                <label htmlFor="cabPickup">Pickup Location:</label>
                <input
                  type="text"
                  id="cabPickup"
                  name="cabPickup"
                  placeholder="Enter Pickup Location"
                  required
                />
              </div>
              <div>
                <label htmlFor="cabDropoff">Dropoff Location:</label>
                <input
                  type="text"
                  id="cabDropoff"
                  name="cabDropoff"
                  placeholder="Enter Dropoff Location"
                  required
                />
              </div>
              <div>
                <label htmlFor="cabDate">Travel Date:</label>
                <input
                  type="date"
                  id="cabDate"
                  name="cabDate"
                  required
                />
              </div>
              <div>
                <label htmlFor="cabTime">Preferred Time:</label>
                <input
                  type="time"
                  id="cabTime"
                  name="cabTime"
                  required
                />
              </div>
              <input type="submit" value="Book Now" />
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
