import  { useState, useEffect } from 'react';
import supabase from '../../../supabase'; // Import Supabase client
import { Snackbar, Alert, Button, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../../styles/finance/BillManager.css';

const BillManager = () => {
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billStatus, setBillStatus] = useState('paid');
  const [bills, setBills] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBillId, setCurrentBillId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const { data, error } = await supabase.from('BillManager').select('*');
    if (error) {
      setSnackbarMessage('Error fetching bills: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } else {
      setBills(data);
    }
  };

  const handleSaveBill = async () => {
    if (!billName || !billAmount || !billDate || !billStatus) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const newBill = {
      billname: billName,
      billamount: billAmount,
      duedate: billDate,
      status: billStatus,
    };

    let data, error;
    if (isEditMode) {
      ({ data, error } = await supabase.from('BillManager').update(newBill).match({ id: currentBillId }));
    } else {
      ({ data, error } = await supabase.from('BillManager').insert([newBill]));
    }

    if (error) {
      setSnackbarMessage('Error saving bill: ' + error.message);
      setSnackbarSeverity('error');
    } else {
      // Refresh the bill list after adding or updating a bill
      if (data && data.length > 0) {
        if (isEditMode) {
          setBills(bills.map(bill => (bill.id === currentBillId ? data[0] : bill)));
        } else {
          setBills([...bills, data[0]]);
        }
      }
      setBillName('');
      setBillAmount('');
      setBillDate('');
      setBillStatus('paid');
      setSnackbarMessage(`Bill ${isEditMode ? 'updated' : 'added'} successfully!`);
      setSnackbarSeverity('success');
    }
    setOpenSnackbar(true);
    setOpenDialog(false);
  };

  // Function to handle delete bill
  const handleDeleteBill = async (id) => {
    const { error } = await supabase.from('BillManager').delete().match({ id });
    if (error) {
      setSnackbarMessage('Error deleting bill: ' + error.message);
      setSnackbarSeverity('error');
    } else {
      setBills(bills.filter(bill => bill.id !== id));
      setSnackbarMessage('Bill deleted successfully!');
      setSnackbarSeverity('success');
    }
    setOpenSnackbar(true);
  };

  const openDialogForEdit = (bill = null) => {
    if (bill) {
      setBillName(bill.billname);
      setBillAmount(bill.billamount);
      setBillDate(bill.duedate);
      setBillStatus(bill.status);
      setCurrentBillId(bill.id);
      setIsEditMode(true);
    } else {
      setBillName('');
      setBillAmount('');
      setBillDate('');
      setBillStatus('paid');
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleBack = () => {
    navigate('/finance')
  }

  return (
    <>
      <Helmet>
        <title>Finance - Bill Manager</title>
      </Helmet>
      <div className="bill-manager-container">
        <h1 style={titleStyle}>Bill Manager</h1>
        <Box sx={buttonsStyle}>
          <Button variant="contained" color="primary" onClick={handleBack} style={buttonStyle}>
            Go Back
          </Button>

          <Button variant="contained" color="info" onClick={() => openDialogForEdit()} style={buttonStyle}>
            Add Bill
          </Button>
        </Box>

        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={thTdStyle}>Bill Name</TableCell>
                <TableCell style={thTdStyle}>Amount</TableCell>
                <TableCell style={thTdStyle}>Due Date</TableCell>
                <TableCell style={thTdStyle}>Status</TableCell>
                <TableCell style={thTdStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell style={thTdStyle}>{bill.billname}</TableCell>
                  <TableCell style={thTdStyle}>{bill.billamount}</TableCell>
                  <TableCell style={thTdStyle}>{bill.duedate}</TableCell>
                  <TableCell style={{ ...thTdStyle, ...statusStyle, ...statusClasses[getStatusClass(bill.status)] }}>
                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                  </TableCell>
                  <TableCell style={thTdStyle}>
                    <IconButton onClick={() => openDialogForEdit(bill)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteBill(bill.id)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{isEditMode ? 'Edit Bill' : 'Add Bill'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Bill Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              required
            />
            <TextField
              label="Amount"
              variant="outlined"
              fullWidth
              margin="normal"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              required
            />
            <TextField
              label="Due Date"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />
            <Select
              label="Status"
              variant="outlined"
              fullWidth
              margin="normal"
              value={billStatus}
              onChange={(e) => setBillStatus(e.target.value)}
            >
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveBill} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <Button color="inherit" onClick={handleCloseSnackbar}>
              Close
            </Button>
          }
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

// Inline styles



const buttonsStyle = {
  marginTop: '20px',
  gap: '5px',
  display: 'flex',
  marginBottom: '10px',
};

const titleStyle = {
  textAlign: 'center',
  color: '#6a1b9a',
};

const buttonStyle = {
  marginBottom: '20px',
};

const thTdStyle = {
  textAlign: 'center',
  color: '#333',
};

const statusStyle = {
  textTransform: 'capitalize',
};

const statusClasses = {
  paid: { color: '#4caf50' }, // Green
  unpaid: { color: '#f44336' }, // Red
  pending: { color: '#ff9800' }, // Orange
};

const getStatusClass = (status) => {
  switch (status) {
    case 'paid':
      return 'paid';
    case 'unpaid':
      return 'unpaid';
    case 'pending':
      return 'pending';
    default:
      return '';
  }
};

export default BillManager;
