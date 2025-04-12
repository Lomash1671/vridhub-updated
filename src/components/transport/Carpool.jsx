import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const Carpool = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const handleRideAction = (actionType) => {
    if (actionType === 'success') {
      setToastMessage('Ride successfully booked!');
      setToastVariant('success');
    } else {
      setToastMessage('There was an error booking the ride.');
      setToastVariant('danger');
    }
    setShowToast(true);
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    margin: 0,
    padding: 0,
    backgroundColor: '#f4f4f4',
    color: '#333',
  };

  const headerStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px 0',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  };

  const navStyle = {
    backgroundColor: '#333',
    padding: '15px',
    textAlign: 'center',
  };

  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 15px',
    fontSize: '1.2em',
    padding: '8px 12px',
    borderRadius: '5px',
  };

  const heroStyle = {
    backgroundImage: 'url(https://via.placeholder.com/1600x500)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '300px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textShadow: '2px 2px 8px #000',
  };

  const heroHeadingStyle = {
    fontSize: '2.8em',
    fontWeight: 'bold',
    padding: '0 15px',
  };

  const contentStyle = {
    padding: '30px 15px',
    textAlign: 'center',
    backgroundColor: '#fff',
    margin: '30px 0',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
    borderRadius: '8px',
  };

  const featureStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    margin: '30px 0',
  };

  const featureItemStyle = {
    flex: '1',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const featureImageStyle = {
    width: '100%',
    height: '0',
    paddingBottom: '56.25%', // This keeps a 16:9 aspect ratio
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '15px',
    borderRadius: '8px',
  };

  const featureTextStyle = {
    fontSize: '1em',
    color: '#666',
  };

  const ctaButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    textDecoration: 'none',
  };

  const inputStyle = {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '0.9em',
  };

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const footerStyle = {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
    marginTop: '40px',
    fontSize: '0.9em',
  };

  return (
    <>
    <Helmet>
      <title>Transport - Carpooling Service</title>
    </Helmet>
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Elderly Carpool Service</h1>
        <p>Safe and Convenient Rides for Seniors</p>
      </header>

      <nav style={navStyle}>
        <a href="#home" style={navLinkStyle}>Home</a>
        <a href="#features" style={navLinkStyle}>Carpool Options</a>
        <a href="#accessibility" style={navLinkStyle}>Accessibility</a>
        <a href="#contact" style={navLinkStyle}>Contact Us</a>
      </nav>

      <section style={heroStyle}>
        <h1 style={heroHeadingStyle}>Connecting Seniors, One Ride at a Time</h1>
      </section>

      <section style={contentStyle} id="features">
        <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>Carpooling Options</h2>
        <div style={featureStyle}>
          <div style={featureItemStyle}>
            <div
              style={{
                ...featureImageStyle,
                backgroundImage: 'url(https://via.placeholder.com/400x225)', // Sample image
              }}
            ></div>
            <h3>Join a Carpool</h3>
            <p style={featureTextStyle}>Find and join carpool groups exclusively for seniors in your area. Enjoy safe, reliable rides with companions you can trust.</p>
            <div style={formContainerStyle}>
              <label htmlFor="carpool-date">Select Date:</label>
              <input type="date" id="carpool-date" name="carpool-date" style={inputStyle} /><br />
              <label htmlFor="carpool-time">Select Time:</label>
              <input type="time" id="carpool-time" name="carpool-time" style={inputStyle} /><br />
              <button
                onClick={() => handleRideAction('success')}
                style={ctaButtonStyle}
              >
                Find a Ride
              </button>
            </div>
          </div>
          <div style={featureItemStyle}>
            <div
              style={{
                ...featureImageStyle,
                backgroundImage: 'url(https://via.placeholder.com/400x225)', // Sample image
              }}
            ></div>
            <h3>Offer a Ride</h3>
            <p style={featureTextStyle}>If you drive and have extra space, offer a ride to fellow seniors. Help build a supportive community while sharing the journey.</p>
            <div style={formContainerStyle}>
              <label htmlFor="offer-date">Select Date:</label>
              <input type="date" id="offer-date" name="offer-date" style={inputStyle} /><br />
              <label htmlFor="offer-time">Select Time:</label>
              <input type="time" id="offer-time" name="offer-time" style={inputStyle} /><br />
              <button
                onClick={() => handleRideAction('error')}
                style={ctaButtonStyle}
              >
                Offer a Ride
              </button>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer className="p-3" position="top-end">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg={toastVariant}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
    </>
  );
};

export default Carpool;
