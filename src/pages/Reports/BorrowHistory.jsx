import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import BorrowHistoryTable from './BorrowHistoryTable';
import CustomSnackbar from 'components/CustomSnackbar';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 

function BorrowHistory() {
  // State to store borrow history data and error message
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [error, setError] = useState(null); // State for error message
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Default to success
  const { isLoggedIn, loading, userToken } = useAuth();

  const fetchBorrowHistory = async () => {
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }

    console.log('token fetch', userToken);
    const token = userToken;

    try {
      const response = await fetch(`${BASE_URL}/reports/borrowing-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setBorrowHistory(data || []);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      setError(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setBorrowHistory([]);
    }
  };

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Borrowing History</Typography>
            <BorrowHistoryTable borrowHistory={borrowHistory} />
          </CardContent>
        </Card>
      </Grid>

      {/* Snackbar to display error */}
      <CustomSnackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        message={error}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Grid>
  );
}

export default BorrowHistory;
