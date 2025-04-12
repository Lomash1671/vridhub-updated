import React, { useState, useEffect } from 'react';
import supabase from '../../../supabase';
import { Snackbar, Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material';
import { Spinner } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const { data, error } = await supabase
        .from('prescription')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching prescriptions: ', error);
      } else {
        setPrescriptions(data);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setAlert({ message: 'Please select a file first!', type: 'error' });
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    const fileName = `${Date.now()}_${file.name}`;

    const { data: storageData, error: uploadError } = await supabase.storage
      .from('prescriptions')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file: ', uploadError);
      setAlert({ message: 'Error uploading file. Please try again.', type: 'error' });
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    const filePath = `${supabaseUrl}/storage/v1/object/public/prescriptions/${fileName}`;

    const { data, error: insertError } = await supabase
      .from('prescription')
      .insert([{ file: file.name, file_path: filePath }]);

    if (insertError) {
      console.error('Error saving prescription to database: ', insertError);
      setAlert({ message: 'Error saving prescription to database. Please try again.', type: 'error' });
    } else {
      setAlert({ message: 'Prescription uploaded successfully', type: 'success' });
      setFile(null);
      setPrescriptions([...prescriptions, { file: file.name, file_path: filePath }]);
    }
    setLoading(false);
    setOpenSnackbar(true);
    setOpenDialog(false); // Close dialog after upload
  };

  const handleDelete = async (id, fileName) => {
    const { error: deleteStorageError } = await supabase.storage
      .from('prescriptions')
      .remove([fileName]);

    if (deleteStorageError) {
      console.error('Error deleting file from storage: ', deleteStorageError);
      setAlert({ message: 'Error deleting file from storage. Please try again.', type: 'error' });
      setOpenSnackbar(true);
      return;
    }

    const { error: deleteDbError } = await supabase
      .from('prescription')
      .delete()
      .eq('id', id);

    if (deleteDbError) {
      console.error('Error deleting prescription from database: ', deleteDbError);
      setAlert({ message: 'Error deleting prescription from database. Please try again.', type: 'error' });
      setOpenSnackbar(true);
      return;
    }

    setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
    setAlert({ message: 'Prescription deleted successfully', type: 'success' });
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleBack = () => {
    // navigate back
    navigate('/health')
  }

  return (
    <>
    <Helmet>
      <title>Health - Prescription</title>
    </Helmet>
    <div>
      <main className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh', padding: '20px' }}>
        {/* Display loading animation */}
        {loading && <Spinner animation="border" role="status">
          <span className="visually-hidden">Uploading...</span>
        </Spinner>}

        <Box sx={buttonsStyle}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            sx={buttonStyle}
          >
            Go Back
          </Button>

          <Button variant="contained" color="primary" onClick={handleClickOpenDialog} style={buttonStyle}>
          Add Prescription
        </Button>
        </Box>
        {/* Prescription List */}
        <div className="container" style={containerStyle}>
          <section>
            <h2 className="text-center" style={{ color: '#671d80' }}>View Your Prescriptions</h2>
            <ul className="list-unstyled">
              {prescriptions.map((prescription) => (
                <li
                  key={prescription.id}
                  className="d-flex justify-content-between align-items-center p-3 mb-3"
                  style={prescriptionListItemStyle}
                >
                  {prescription.file}: <a href={prescription.file_path} target="_blank" rel="noopener noreferrer" style={linkStyle}>Download/View</a>
                  <button
                    onClick={() => handleDelete(prescription.id, `${Date.now()}_${prescription.file}`)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Button to open the upload dialog */}


        {/* Upload Prescription Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Upload New Prescription</DialogTitle>
          <DialogContent>
            <div className="file-input text-center mb-3">
              <TextField
                type="file"
                id="prescriptionUpload"
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
                fullWidth
                inputProps={{ accept: '.pdf,.jpg,.png' }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleFileUpload}
              color="primary"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </Dialog>
      </main>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
    </>
  );
};

// Inline styles for custom color themes
const headerStyle = {
  backgroundColor: '#671d80',
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

const prescriptionListItemStyle = {
  backgroundColor: '#f1f8e9',
  border: '1px solid #c8e6c9',
  borderRadius: '10px',
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  cursor: 'pointer',
  padding: '10px',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#671d80',
  fontWeight: 'bold',
};

const buttonStyle = {
  backgroundColor: '#671d80',
  borderColor: '#671d80',
  color: 'white',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};
const buttonsStyle = {
  marginTop: '20px',
  gap: '5px',
  display: 'flex',
  marginBottom: '10px',
};

const deleteButtonStyle = {
  backgroundColor: '#d32f2f',
  borderColor: '#d32f2f',
  color: 'white',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
};

export default Prescription;
