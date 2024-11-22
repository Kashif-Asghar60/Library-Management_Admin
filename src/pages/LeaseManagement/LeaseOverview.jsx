import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Snackbar } from '@mui/material';
import LeaseTable from './LeaseTable';
import CustomSnackbar from 'components/CustomSnackbar';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 
const LeaseOverview = () => {
  // State to store lease data and error message
  const [leases, setLeaseData] = useState([]);
  const [error, setError] = useState(null); // State for error message
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Default to success
  //const token = '4|4LaUb5B4Ga310o9oKDjodnVRBDgRnnbL1I244p4b21c4060d';
  const { isLoggedIn, userToken } = useAuth();

  const fetchLeaseData = async () => {
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }

    const token = userToken;
    try {
      const response = await fetch(`${BASE_URL}/books/borrowed`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setLeaseData(data || []);
    } catch (error) {
      console.error('Error fetching lease data:', error);
      setError(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLeaseData([]);
    }
  };

 // Function to update the lease data
 const updateLeaseData = (updatedLease) => {
  setLeaseData((prevLeases) =>
    prevLeases.map((lease) =>
      lease.id === updatedLease.id ? { ...lease, ...updatedLease } : lease
    )
  );
  // Trigger a refetch of the lease data after the update
  fetchLeaseData(); // Refetch the lease data
};

  // Fetch lease data from API
  useEffect(() => {
    fetchLeaseData();
  }, []); // Empty array ensures this runs once

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Lease Overview</Typography>
            <LeaseTable leases={leases} updateLeaseData={updateLeaseData} />
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
};

export default LeaseOverview;
