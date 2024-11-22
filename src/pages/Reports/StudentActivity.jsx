import React, { useEffect, useState } from 'react';
import { Card, Typography, Grid, Box, CircularProgress, CardContent } from '@mui/material';
import { PersonOutline, LibraryBooks } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 

const StudentActivity = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, userToken } = useAuth();

  // Fetch student activity data
  useEffect(() => {
    const fetchStudentActivity = async () => {
      if (!userToken) {
        console.log('No token available');
        return; // Return early if no token is available
      }
  
      const token = userToken;
      try {
         const response = await fetch(`${BASE_URL}/reports/student-activity`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student activity');
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentActivity();
  }, []);

  // Filter students with role "student"
  const studentList = students.filter(student => student.role === "student");

  // Summary statistics
  const totalStudents = studentList.length;
  const totalBooksBorrowed = studentList.reduce((acc, student) => acc + student.books_borrowed, 0);

  if (loading) {
    return (
      <Card sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          <PersonOutline style={{ marginRight: 8 }} /> Student Activity Report
        </Typography>
      </Box>

      {error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {/* Summary Statistics Widget */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4" color="primary">
                {totalStudents}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Total Books Borrowed
              </Typography>
              <Typography variant="h4" color="secondary">
                {totalBooksBorrowed}
              </Typography>
            </Card>
          </Grid>

          {/* Student Activity List */}
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student Activity
                </Typography>
                {studentList.map((student) => (
                  <Grid container spacing={2} key={student.id}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {student.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Role: {student.role}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Books Borrowed: {student.books_borrowed}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Card>
  );
};

export default StudentActivity;
