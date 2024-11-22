import React from 'react';
import PopularBooks from './PopularBooks';
import OverdueBooks from './OverdueBooks';
import StudentActivity from './StudentActivity';
import { Grid, Card, CardContent, Typography } from '@mui/material';

function Reports() {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      
      {/* Grid layout for the reports */}
      <Grid container spacing={3}>
        {/* First row - Popular Books (spans the full width) */}
        <Grid item xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overdue Books
              </Typography>
              <OverdueBooks />
            </CardContent>
          </Card>
        </Grid>

        {/* Second row - Overdue Books and Student Activity (2 columns) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Books
              </Typography>
              <PopularBooks/>
       
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Student Activity
              </Typography>
              <StudentActivity />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Reports;
