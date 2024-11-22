import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, CircularProgress } from '@mui/material';
import { AlarmOutlined, SendOutlined, NotificationImportantOutlined } from '@mui/icons-material';
import CustomSnackbar from 'components/CustomSnackbar';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 

const OverdueBooks = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const { isLoggedIn, userToken } = useAuth();
  useEffect(() => {
    const fetchOverdueBooks = async () => {
      if (!userToken) {
        console.log('No token available');
        return; // Return early if no token is available
      }
  
      console.log('token fetch', userToken);
      const token = userToken;
      try {
            const response = await fetch(`${BASE_URL}/reports/overdue-books`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch overdue books');
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setOverdueBooks(data);
        } else {
          setError('No overdue books found');
        }
      } catch (error) {
        setError(error.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueBooks();
  }, []);

  const handleSendReminder = async () => {
    try {
      if (!userToken) {
        console.log('No token available');
        return; // Return early if no token is available
      }
  
     // console.log('token fetch', userToken);
      const token = userToken;
            const response = await fetch(`${BASE_URL}/notifications/return-reminders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send return reminders');
      }

      setSnackbar({ open: true, message: 'Return reminders sent successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'An error occurred while sending return reminders', severity: 'error' });
    }
  };

  const handleNotifyOverdue = async () => {
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }

   // console.log('token fetch', userToken);
    const token = userToken;
    try {
            const response = await fetch(`${BASE_URL}/notifications/overdue`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to notify overdue users');
      }

      setSnackbar({ open: true, message: 'Overdue users notified successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'An error occurred while notifying overdue users', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Card sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <div sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          <AlarmOutlined style={{ color: 'red', marginRight: 8 }} /> 
        </Typography>

        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendOutlined />}
            sx={{ marginRight: 1 }}
            onClick={handleSendReminder}
          >
            Send Reminder for Return
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<NotificationImportantOutlined />}
            onClick={handleNotifyOverdue}
          >
            Notify Overdue Users
          </Button>
        </Box>
      </Box>

      {error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {overdueBooks.map((entry) => (
            <Grid item xs={12} key={entry.id}>
              <Card sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {entry.book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {entry.book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Borrowed by: Student - {entry.student.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due Date: {new Date(entry.due_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="error">
                    Status: Overdue
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default OverdueBooks;
