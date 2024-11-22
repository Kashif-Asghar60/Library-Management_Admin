import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 

// Table column headers
const headCells = [
  { id: 'id', align: 'left', disablePadding: false, label: 'User ID' },
  { id: 'name', align: 'left', disablePadding: true, label: 'Name' },
  { id: 'email', align: 'left', disablePadding: false, label: 'Email' },
  { id: 'role', align: 'left', disablePadding: false, label: 'Role' },
  { id: 'created_at', align: 'right', disablePadding: false, label: 'Created Date' }
];

// Header component
function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| USER TABLE ||============================== //

export default function UserTable() {
  const [users, setUsers] = useState([]);  // State to store the fetched users
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const { userToken } = useAuth();  // Access user token from context
  const order = 'asc';
  const orderBy = 'id';

  // Fetch users from the API
  const fetchUsers = async () => {
    if (!userToken) {
      console.log('No token available');
      return;  // Return early if no token is available
    }

    try {
      console.log('Fetching users... apoi', BASE_URL  ,"token", userToken);
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'ngrok-skip-browser-warning': 'true',  // Add this header to skip Ngrok warning page

        },
      });
      const data = await response.json();
      console.log('data here', data);
      if (response.ok) {
        setUsers(data);  // Update users state with the fetched data
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);  // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userToken]);  // Run fetch when userToken changes

  if (loading) {
    return <Typography variant="h6">Loading users...</Typography>;  // Display loading message
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;  // Display error message
  }

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(users, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary">{row.id}</Link>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell align="right">{row.created_at}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
