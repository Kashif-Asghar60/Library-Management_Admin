import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Link, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, Alert } from '@mui/material';
import CustomSnackbar from 'components/CustomSnackbar';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 
// Table column headers
const leaseHeadCells = [
    { id: 'id', label: 'Lease ID' },
    { id: 'book_title', label: 'Book Title' },
    { id: 'student_name', label: 'Student Name' },
    { id: 'status', label: 'Status' },
    { id: 'borrowed_at', label: 'Borrowed At' },
    { id: 'due_date', label: 'Due Date' },
  ];
  
  // Header component
  function LeaseTableHead() {
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox"></TableCell> {/* Checkbox Column */}
          {leaseHeadCells.map((headCell) => (
            <TableCell key={headCell.id} align="left" sx={{ minWidth: 150 }}>
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  const LeaseTable = ({ leases, updateLeaseData })  => {
    const [selectedLeases, setSelectedLeases] = useState([]);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openModifyDateDialog, setOpenModifyDateDialog] = useState(false);
  const [newDueDate, setNewDueDate] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Default to success
  const { isLoggedIn, userToken } = useAuth();

  //const token = '4|4LaUb5B4Ga310o9oKDjodnVRBDgRnnbL1I244p4b21c4060d';
  console.log('Leases prop:', leases);

  const handleCheckboxChange = (event, leaseId) => {
    if (event.target.checked) {
      setSelectedLeases([leaseId]); // Allow only one lease selection
    } else {
      setSelectedLeases([]);
    }
  };

  const handleMarkAsReturnedClick = () => setOpenReturnDialog(true);
  const handleModifyDateClick = () => setOpenModifyDateDialog(true);
  
  const handleCloseReturnDialog = () => setOpenReturnDialog(false);
  const handleCloseModifyDateDialog = () => setOpenModifyDateDialog(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const markAsReturned = async () => {
    const leaseId = selectedLeases[0];
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }

    const token = userToken;
    try {
      const response = await fetch(`${BASE_URL}/books/copies/${leaseId}/return`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (response.ok) {
        setSnackbarMessage('Book marked as returned successfully');
        setSnackbarOpen(true);
        setSnackbarSeverity('success'); // Success severity
        setOpenReturnDialog(false);
          // Update the state on LeaseOverview after marking as returned
          updateLeaseData({ id: leaseId, status: 'Returned' });
      } else {
        const errorData = await response.json();
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to mark as returned'}`);
        setSnackbarOpen(true);
        setSnackbarSeverity('error'); // Error severity
      }
    } catch (error) {
      console.error('Failed to mark as returned', error);
      setSnackbarMessage('Failed to mark as returned. Please try again later.');
      setSnackbarOpen(true);
      setSnackbarSeverity('error'); // Error severity
    }
  };
  
  const modifyDueDate = async () => {
    const leaseId = selectedLeases[0];
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }
  
    const token = userToken;
    try {
      const response = await fetch(`${BASE_URL}/books/copies/${leaseId}/due-date`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ due_date: newDueDate })
      });
  
      if (response.ok) {
        setSnackbarMessage('Due date updated successfully');
        setSnackbarOpen(true);
        setSnackbarSeverity('success'); // Success severity
        setOpenModifyDateDialog(false);
        // Update the state on LeaseOverview after modifying due date
        updateLeaseData({ id: leaseId, due_date: newDueDate });
      } else {
        const errorText = await response.text(); // Get response as text
        let errorData = {};
        try {
          errorData = JSON.parse(errorText); // Try to parse the error text as JSON
        } catch (e) {
          errorData.message = errorText; // In case it's not a valid JSON
        }
        setSnackbarMessage(`Error: ${errorData.message || 'Failed to update due date'}`);
        setSnackbarOpen(true);
        setSnackbarSeverity('error'); // Error severity
      }
    } catch (error) {
      console.error('Failed to modify due date', error);
      setSnackbarMessage('Failed to update due date. Please try again later.');
      setSnackbarOpen(true);
      setSnackbarSeverity('error'); // Error severity
    }
  };
  
  

  return (
    <div>
    {/* Render the table or other UI elements */}
    {leases && leases.length > 0 ? (
    
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2, paddingTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleMarkAsReturnedClick}

          sx={{
            marginRight: 1,
            opacity: selectedLeases.length > 0 ? 1 : 0.6, // Slight dim effect when disabled
            pointerEvents: selectedLeases.length > 0 ? 'auto' : 'none', // Disable interactions when dimmed
          }}
        >
          Mark as Returned
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleModifyDateClick}
          sx={{
            marginRight: 1,
            opacity: selectedLeases.length > 0 ? 1 : 0.6, // Slight dim effect when disabled
            pointerEvents: selectedLeases.length > 0 ? 'auto' : 'none', // Disable interactions when dimmed
          }}
        >
          Modify Return Date
        </Button>
      </Box>

      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {leaseHeadCells.map((headCell) => (
                <TableCell key={headCell.id} align="left" sx={{ minWidth: 150 }}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {leases.map((lease) => (
              <TableRow key={lease.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedLeases.includes(lease.id)}
                    onChange={(e) => handleCheckboxChange(e, lease.id)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link color="secondary">{lease.id}</Link>
                </TableCell>
                <TableCell>{lease.book.title}</TableCell>
                <TableCell>{lease.student.name}</TableCell>
                <TableCell>{lease.status}</TableCell>
                <TableCell>{new Date(lease.borrowed_at).toLocaleString()}</TableCell>
                <TableCell>{new Date(lease.due_date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mark as Returned Confirmation Dialog */}
      <Dialog open={openReturnDialog} onClose={handleCloseReturnDialog}>
        <DialogTitle>Confirm Return</DialogTitle>
        <DialogContent>Are you sure you want to mark this book as returned?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReturnDialog} color="primary">Cancel</Button>
          <Button onClick={markAsReturned} color="secondary">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Modify Due Date Dialog */}
      <Dialog
  open={openModifyDateDialog}
  onClose={handleCloseModifyDateDialog}
  maxWidth="sm"  // Set maximum width to small (you can adjust this as needed)
  fullWidth
>
  <DialogTitle sx={{ fontSize: '1.5rem', paddingBottom: '8px' }}>Modify Due Date</DialogTitle>
  <DialogContent sx={{ minWidth: 400, paddingTop: 2 }}>
   <div style={ {paddingTop: 10}}>
    <TextField
      label="New Due Date"
      type="date"
      value={newDueDate}
      onChange={(e) => setNewDueDate(e.target.value)}
      fullWidth
      InputLabelProps={{ shrink: true }}
      sx={{ fontSize: '1.2rem' }}
    />
    </div>
  </DialogContent>
  <DialogActions sx={{ padding: '16px' }}>
    <Button onClick={handleCloseModifyDateDialog} color="primary" sx={{ fontSize: '1rem' }}>
      Cancel
    </Button>
    <Button onClick={modifyDueDate} color="secondary" sx={{ fontSize: '1rem' }}>
      Update
    </Button>
  </DialogActions>
</Dialog>

      {/* Snackbar for Success and Failure Messages */}
      
      <CustomSnackbar
  open={snackbarOpen}
  message={snackbarMessage}
  onClose={() => setSnackbarOpen(false)}
  severity={snackbarSeverity}
/>
    </Box>
     ) : (
      <div>No leases to display.</div>
    )}
  </div>
  );
}

LeaseTable.propTypes = {
  leases: PropTypes.array.isRequired,
  updateLeaseData: PropTypes.func.isRequired,

};
export default LeaseTable;
