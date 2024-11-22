// src/pages/UserManagement/ViewUsers.jsx
import React from 'react';
import Box from '@mui/material/Box';
import UserTable from './UserTable'; // Adjust the path to where UserTable is located
import MainCard from 'components/MainCard';

const ViewUsers = () => {
  return (
    <Box sx={{ padding: '16px', maxWidth: '100vw', maxHeight: '100vh' }}>
      <h2>User Management</h2>
      {/* Table with user data */}

      <MainCard sx={{ mt: 2 }} content={false}>
      <UserTable />
        </MainCard>
    </Box>
  );
};

export default ViewUsers;
