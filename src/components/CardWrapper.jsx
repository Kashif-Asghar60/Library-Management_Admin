// CardWrapper.js
import React from 'react';
import { Card } from '@mui/material';

const CardWrapper = ({ children }) => {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100vh', // Full height of the viewport
        display: 'flex',
        flexDirection: 'column', // Stack the content vertically
        backgroundColor: '#f4f4f4',
        padding: 3,
      }}
    >
      {children}
    </Card>
  );
};

export default CardWrapper;
