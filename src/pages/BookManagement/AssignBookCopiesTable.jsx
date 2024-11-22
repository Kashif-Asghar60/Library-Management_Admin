import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem } from '@mui/material';
import { Delete, Edit,Add } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 
const BookCopiesTable = ({ bookCopies }) => {
  console.log('bookCopies in BookCopiesTable:', bookCopies); // Debugging log

  const [selected, setSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { isLoggedIn, userToken } = useAuth();

  //const token = '7|MC9neSGR63GpH4RTIfa0FiSt7VU833bB0888DUJb0206b930';

  // Fetch list of students
  useEffect(() => {
    const fetchStudents = async () => {
      if (!userToken) {
        console.log('No token available');
        return; // Return early if no token is available
      }
  
      const token = userToken;

      const response = await fetch(`${BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStudents(data.filter(student => student.role === 'student'));
    };
    fetchStudents();
  }, []);

  // Safety check for undefined or empty array
  if (!bookCopies || bookCopies.length === 0) {
    return <p>No book copies available.</p>; // Display fallback message
  }

  // Group book copies by book_id to calculate total and available copies
  const groupedBookCopies = bookCopies.reduce((acc, copy) => {
    if (!acc[copy.book.id]) {
      acc[copy.book.id] = { book: copy.book, total: 0, available: 0, students: [] };
    }
    acc[copy.book.id].total += 1;
    if (copy.status !== 'Borrowed') {
      acc[copy.book.id].available += 1;
    }
    if (copy.student) {
      acc[copy.book.id].students.push(copy.student.name);
    }
    return acc;
  }, {});

  // Convert the grouped data into an array for easy rendering
  const groupedData = Object.values(groupedBookCopies);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString();
  };


  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id); // Deselect
      } else {
        return [...prevSelected, id]; // Select
      }
    });
  };

  const openAssignDialogHandler = () => {
    if (selected.length === 1) {
      const selectedBook = bookCopies.find(copy => copy.id === selected[0]);
      setSelectedCopy(selectedBook);
      setOpenAssignDialog(true);
    } else {
      alert("Please select one book to assign.");
    }
  };
  const closeAssignDialog = () => {
    setOpenAssignDialog(false);
    setSelectedStudent('');
    setDueDate('');
  };

  // Open edit dialog
  const openEditDialog = () => {
    if (selected.length === 1) {
      const copyToEdit = bookCopies.find(copy => copy.id === selected[0]);
      setSelectedCopy(copyToEdit);
      setOpenDialog(true);
    }
  };

  // Close edit dialog
  const closeEditDialog = () => {
    setOpenDialog(false);
    setSelectedCopy(null);
  };

  // Handle delete (just a placeholder)
  const handleDelete = () => {
    console.log('Delete selected items:', selected);
    // Handle delete for selected copies
  };

    // Handle assign book
// Handle assign book

const handleAssignBook = async () => {
    if (!dueDate) {
      alert("Please select a return date before assigning the book.");
      return;
    }
  

    const selectedBookId = selected[0];
    const requestData = {
      student_id: selectedStudent,
      due_date: dueDate,
    };
  
    console.log("Assign Book Request Data:", requestData);
   if (!userToken) {
        console.log('No token available');
        return; // Return early if no token is available
      }
  
      const token = userToken;
    try {
      // Make a POST request with Axios
      const response = await axios.post(
        `${BASE_URL}/books/${selectedBookId}/assign`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Axios automatically parses the response as JSON
      console.log("Response Data:", response.data);
  
      // Close the dialog after successful response
      closeAssignDialog();
    } catch (error) {
      // Handle errors here
      if (error.response) {
        // Request was made and the server responded with an error status code
        console.error("Response error:", error.response.data);
        
        // Show error message to the user
        alert(`Error: ${error.response.data.error || 'An error occurred.'}`);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Request error:", error.request);
        alert("No response received from the server. Please check the server.");
      } else {
        // Something happened while setting up the request
        console.error("General error:", error.message);
        alert("An unexpected error occurred.");
      }
    }
  };
  
  
    
  return (
    <Box>
         {/* Action buttons */}
         <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton onClick={handleDelete}>
          <Delete />
        </IconButton>
        <IconButton onClick={openEditDialog} disabled={selected.length !== 1}>
          <Edit />
        </IconButton>
        <IconButton onClick={openAssignDialogHandler}>
          <Add />
        </IconButton>
      </Box>

      {/* Table displaying book copies */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell sx={{ minWidth: 150 }}>Book Title</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Total Copies</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Available Copies</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Status</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Students</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Borrowed Date</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Due Date</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Edition</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Location</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Rating</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData.map((group) => (
              <TableRow key={group.book.id}>
                <TableCell padding="checkbox">
                  <input
                    type="checkbox"
                    checked={selected.includes(group.book.id)}
                    onChange={() => handleCheckboxChange(group.book.id)}
                  />
                </TableCell>
                <TableCell>{group.book.title}</TableCell>
                <TableCell>{group.total}</TableCell>
                <TableCell>{group.available}</TableCell>
                {/* Display the status of the first copy or any other relevant info */}
                <TableCell>{bookCopies.find(copy => copy.book.id === group.book.id)?.status}</TableCell>
                <TableCell>
                  {/* Display all student names who borrowed this book */}
                  {group.students.length > 0 ? group.students.join(', ') : 'N/A'}
                </TableCell>
                <TableCell>{formatDate(bookCopies.find(copy => copy.book.id === group.book.id)?.borrowed_at)}</TableCell>
                <TableCell>{formatDate(bookCopies.find(copy => copy.book.id === group.book.id)?.due_date)}</TableCell>
                <TableCell>{group.book.edition}</TableCell>
                <TableCell>{group.book.location}</TableCell>
                <TableCell>{group.book.rating}</TableCell>
                <TableCell>{group.book.tags.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Assign Book Dialog */}
     {/* Assign Book Dialog */}
     <Dialog open={openAssignDialog} onClose={closeAssignDialog}>
      <DialogTitle>Assign Book</DialogTitle>
      <DialogContent>
        {selectedCopy && (
          <Typography variant="h6">
            Assigning: {selectedCopy.book.title}
          </Typography>
        )}
        <Select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>Select Student</MenuItem>
          {students.map(student => (
            <MenuItem key={student.id} value={student.id}>
              {student.name} ({student.email})
            </MenuItem>
          ))}
        </Select>
        <TextField
          margin="dense"
          label="Return Date"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          inputProps={{
            min: new Date().toISOString().split("T")[0], // Set the min date to today
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAssignDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAssignBook} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={closeEditDialog}>
        <DialogTitle>Edit Book Copy</DialogTitle>
        <DialogContent>
          {/* Add form fields for editing book copy details */}
          <Typography variant="body1">Editing {selectedCopy?.book?.title}</Typography>
          {/* You can add input fields here for editing */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={closeEditDialog} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookCopiesTable;
