import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { FireOutlined, BookOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 

const PopularBooks = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, userToken } = useAuth();

  useEffect(() => {
    const fetchPopularBooks = async () => {
      if (!userToken) {
        console.log('No token available');
        return; // Return early if no token is available
      }
  
      const token = userToken;
      try {
         const response = await fetch(`${BASE_URL}/reports/popular-books`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch popular books');
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setPopularBooks(data);
        } else {
          setError('No popular books found');
        }
      } catch (error) {
        setError(error.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  if (loading) {
    return (
      <Card sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        <FireOutlined style={{ color: 'red', marginRight: 8 }} /> Popular Books Report
      </Typography>

      {error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : (
        <Grid container spacing={1} sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {popularBooks.map((book) => (
            <Grid item xs={12} key={book.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #ddd' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {book.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    by {book.author}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    <BookOutlined style={{ marginRight: 4 }} /> {book.borrow_count} borrows
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {book.rating.toFixed(1)}
                  </Typography>
                  <Typography variant="caption" color={book.availability_status === 'Available' ? 'green' : 'red'}>
                    {book.availability_status}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Card>
  );
};

export default PopularBooks;
