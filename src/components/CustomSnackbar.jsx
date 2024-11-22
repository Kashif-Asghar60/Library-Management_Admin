import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function CustomSnackbar({ open, message, onClose, severity }) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}

    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
