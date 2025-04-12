import React, { useEffect, useState } from 'react';
import supabase from '../../../supabase'; // import supabase client
import {
  Button,
  TextField,
  Container,
  Alert,
  Box,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [DoctorName, setDoctorName] = useState('');
  const [Speciality, setSpeciality] = useState('');
  const [Contact, setContact] = useState('');
  const [Address, setAddress] = useState('');
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', severity: '' });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const { data, error } = await supabase.from('Doctor_info').select('*');
    if (error) {
      setAlert({ show: true, message: 'Error fetching doctors.', severity: 'error' });
    } else {
      setDoctors(data);
    }
  };

  const addDoctor = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('Doctor_info').insert([
      { DoctorName, Speciality, Contact, Address },
    ]);

    if (error) {
      setAlert({ show: true, message: 'Error adding doctor.', severity: 'error' });
    } else if (data && data.length > 0) {
      setDoctors([...doctors, data[0]]);
      setAlert({ show: true, message: 'Doctor added successfully!', severity: 'success' });
      clearForm();
      setOpenModal(false);
    } else {
      setAlert({ show: true, message: 'Doctor added, please refresh to reflect changes.', severity: 'warning' });
    }
  };

  const updateDoctor = async (doctorId) => {
    const { error } = await supabase
      .from('Doctor_info')
      .update({ DoctorName, Speciality, Contact, Address })
      .eq('id', doctorId);

    if (error) {
      setAlert({ show: true, message: 'Error updating doctor.', severity: 'error' });
    } else {
      fetchDoctors();
      setAlert({ show: true, message: 'Doctor updated successfully!', severity: 'success' });
      setEditingDoctorId(null);
      clearForm();
      setOpenModal(false);
    }
  };

  const deleteDoctor = async (doctorId) => {
    const { error } = await supabase.from('Doctor_info').delete().eq('id', doctorId);
    if (error) {
      setAlert({ show: true, message: 'Error deleting doctor.', severity: 'error' });
    } else {
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
      setAlert({ show: true, message: 'Doctor deleted successfully!', severity: 'success' });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingDoctorId) {
      updateDoctor(editingDoctorId);
    } else {
      addDoctor(e);
    }
  };

  const handleEditClick = (doctor) => {
    setEditingDoctorId(doctor.id);
    setDoctorName(doctor.DoctorName);
    setSpeciality(doctor.Speciality);
    setContact(doctor.Contact);
    setAddress(doctor.Address);
    setOpenModal(true);
  };

  const handleAddClick = () => {
    setEditingDoctorId(null);
    clearForm();
    setOpenModal(true);
  };

  const handleBack = () => {
    // navigate back
    navigate('/health')
  }

  const clearForm = () => {
    setDoctorName('');
    setSpeciality('');
    setContact('');
    setAddress('');
  };

  return (
    <>
      <Helmet>
        <title>Health - Doctor Directory</title>
      </Helmet>
      <Container>

        <main className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh', padding: '20px' }}>
          <Box sx={buttonsStyle}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              sx={buttonStyle}
            >
              Go Back
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddClick}
              sx={buttonStyle}
            >
              Add Doctor
            </Button>
          </Box>
          <Container sx={containerStyle}>
            <section>
              <Typography variant="h4" align="center" color="#671d80">Your Current Doctors</Typography>
              {alert.show && (
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })}>
                  {alert.message}
                </Alert>
              )}
              <Box sx={listStyle}>
                {doctors.map(doctor => (
                  <Paper key={doctor.id} sx={doctorListItemStyle}>
                    <Box>
                      <Typography variant="h5" color="#671d80">{doctor.DoctorName}</Typography>
                      <Typography>Speciality: {doctor.Speciality}</Typography>
                      <Typography>Contact: {doctor.Contact}</Typography>
                      <Typography>Address: {doctor.Address}</Typography>
                    </Box>
                    <Box sx={buttonGroupStyle}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(doctor)}
                        sx={buttonStyle}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteDoctor(doctor.id)}
                        sx={deleteButtonStyle}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </section>
          </Container>



          {/* Modal for form */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>{editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
            <DialogContent>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  label="Doctor's Name"
                  variant="outlined"
                  value={DoctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Speciality"
                  variant="outlined"
                  value={Speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Contact Information"
                  variant="outlined"
                  value={Contact}
                  onChange={(e) => setContact(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Address"
                  variant="outlined"
                  value={Address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)} color="default">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
              >
                {editingDoctorId ? 'Update Doctor' : 'Add Doctor'}
              </Button>
            </DialogActions>
          </Dialog>
        </main>
      </Container>
    </>
  );
};

// MUI styling
const headerStyle = {
  backgroundColor: '#671d80',
  width: '100vw',
  padding: '20px',
  textAlign: 'center',
  color: 'white',
  fontSize: '28px',
  fontWeight: 'bold',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
};

const containerStyle = {
  width: '90%',
  maxWidth: '800px',
  backgroundColor: 'white',
  borderRadius: '15px',
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
  padding: '30px',
  marginBottom: '20px',
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const doctorListItemStyle = {
  padding: '20px',
  borderRadius: '10px',
  backgroundColor: '#e3f2fd',
  border: '1px solid #bbdefb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
};

const buttonStyle = {
  backgroundColor: '#671d80',
  '&:hover': {
    backgroundColor: '#5c2a7f',
  },
};

const buttonsStyle = {
  marginTop: '20px',
  gap: '5px',
  display: 'flex',
  marginBottom: '10px',
};

const deleteButtonStyle = {
  backgroundColor: '#e53935',
  '&:hover': {
    backgroundColor: '#c62828',
  },
};

export default Doctor;
