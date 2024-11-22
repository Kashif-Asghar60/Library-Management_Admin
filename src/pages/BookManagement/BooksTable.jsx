import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Link, Checkbox, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography, Button, Select,
  MenuItem,
  FormControl,
  InputLabel } from '@mui/material';
import CustomSnackbar from 'components/CustomSnackbar';

import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 
// Table column headers
const headCells = [
  { id: 'id', label: 'Book ID' },
  { id: 'cover_image', label: 'Cover Image' },  
  { id: 'title', label: 'Title' },
  { id: 'author', label: 'Author' },
  { id: 'publisher', label: 'Publisher' },
  { id: 'publication_date', label: 'Publication Date' },
  { id: 'genre', label: 'Genre' },
  { id: 'language', label: 'Language' },
  { id: 'description', label: 'Description' },
  { id: 'availability_status', label: 'Availability Status' },
  { id: 'location', label: 'Location' },
  { id: 'page_count', label: 'Page Count' },
  { id: 'isbn', label: 'ISBN' },
 // New column for book cover image
];

// Header component
function BooksTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell> {/* Checkbox Column */}
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" sx={{ minWidth: 150 }}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Main Books Table Component
function BooksTable({ books, onDataChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [coverImage, setCoverImage] = useState(null); 
  const { isLoggedIn, userToken } = useAuth();

console.log("books",books)
  const handleCheckboxChange = (event, bookId) => {
    if (event.target.checked) {
      setSelectedBooks([bookId]); // Only allow one book selection
    } else {
      setSelectedBooks([]); // Deselect when unchecked
    }
  };

  const handleEditClick = () => {
    const book = books.find((b) => b.id === selectedBooks[0]);
    setCurrentBook(book);
    setCoverImage(book.cover_image_url);  // Set current cover image
    setEditMode(true);
    setOpenDialog(true);
  };
  

  const handleAddClick = () => {
    setCurrentBook(null);
    setCoverImage(null);  // Reset cover image
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBook(null);
  };


  const handleDeleteClick = async () => {
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }

    const token = userToken;
    try {
      const deletePromises = selectedBooks.map((bookId) =>
        axios.delete(`${BASE_URL}/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
  
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
  
      // Show success message in snackbar
      setSnackbarMessage('Books deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      // Trigger data refresh in parent component
      onDataChange();
      
      // Clear selected books after deletion
      setSelectedBooks([]);
    } catch (error) {
      console.error('Failed to delete books:', error);
  
      // Handle errors and display a meaningful message
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to delete books. Please try again.';
        setSnackbarMessage(errorMessage);
      } else {
        setSnackbarMessage('Network error: Unable to delete books.');
      }
  
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  

  const languages = ["English", "Spanish", "French", "German", "Chinese", "Arabic", "Urdu"];
  const availabilityStatuses = ["Upcoming", "Available"];
  const locations = ["Shelf A1", "Shelf A2", "Shelf B1", "Shelf B2", "Shelf C1", "Shelf C2"];
  const formats = ["Paperback", "Hardcover", "Ebook", "Audiobook"];
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {

      const preset_key="preset129";
      const cloud_name="dmrhfi20i";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${preset_key}`); // Set this in your Cloudinary settings
  
      try {
        // Replace 'your_cloud_name' with your actual Cloudinary cloud name
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
          formData
        );
  
        // Get the image URL from the response
        const imageUrl = response.data.secure_url;
        console.log("Image uploaded:", imageUrl);
        setCoverImage(imageUrl);  // Set the cover image URL to state
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };
  //const token = '4|4LaUb5B4Ga310o9oKDjodnVRBDgRnnbL1I244p4b21c4060d';

  const handleSaveBook = async () => {
    if (!coverImage) {
      setSnackbarMessage('Please upload a cover image.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; // Prevent submission if no image is uploaded
    }
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }

    const token = userToken;
  
    const newBookData = {
      title: currentBook.title,
      author: currentBook.author,
      isbn: currentBook.isbn,
      genre: currentBook.genre,
      publisher: currentBook.publisher,
      publication_date: currentBook.publication_date,
      language: currentBook.language,
      description: currentBook.description,
      cover_image_url: coverImage, // Ensure the uploaded URL is added here
      page_count: currentBook.page_count,
      location: currentBook.location,
      availability_status: currentBook.availability_status,
      edition: currentBook.edition,
      quantity: currentBook.quantity,
      rating: currentBook.rating,
      tags: currentBook.tags,
      price: currentBook.price,
      book_format: currentBook.book_format,
    };
console.log("New book data:", newBookData);
    
    try {
      const response = await axios.post(
       `${BASE_URL}/books`,
        newBookData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Book added:', response.data);

      setSnackbarMessage('Book added successfully!');
      setSnackbarSeverity('success');
      onDataChange();
      setSnackbarOpen(true);
      setOpenDialog(false);
      setCurrentBook(null);
    } catch (error) {
      if (error.response) {
        // Extract validation errors from the response data
        const errorData = error.response.data;
        let errorMessage = 'Failed to add book.';
    
        if (errorData && errorData.message) {
          // Map through each error field to get a readable message
          errorMessage = Object.keys(errorData.message)
            .map(field => `${field.charAt(0).toUpperCase() + field.slice(1)}: ${errorData.message[field].join(', ')}`)
            .join(' | ');
        }
        
        console.error('Failed to add book:', errorData);
        setSnackbarMessage(errorMessage);
      } else {
        console.error('Failed to add book:', error);
        setSnackbarMessage('Failed to add book.');
      }
    
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    
  };
  const handleUpdateBook = async () => {

      // Check for empty fields
  const requiredFields = [
    'title', 'author', 'isbn', 'genre', 'publisher', 'publication_date',
    'language', 'description', 'page_count', 'location', 'availability_status',
    'edition', 'quantity', 'rating', 'tags', 'price', 'book_format'
  ];

  // Check if any required field is empty
  for (const field of requiredFields) {
    if (!currentBook[field]) {
      setSnackbarMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; // Stop execution if a required field is missing
    }
  }

    let finalCoverImage = coverImage;
  

    // Check if a new image has been uploaded and differs from the existing image
    if (coverImage && coverImage !== currentBook.cover_image_url) {
      // Wait for image upload and set the new URL
      finalCoverImage = coverImage;
    } else {
      // Use the existing cover image URL if no new image is provided
      finalCoverImage = currentBook.cover_image_url;
    }
  
    const updatedBookData = {
      title: currentBook.title,
      author: currentBook.author,
      isbn: currentBook.isbn,
      genre: currentBook.genre,
      publisher: currentBook.publisher,
      publication_date: currentBook.publication_date,
      language: currentBook.language,
      description: currentBook.description,
      cover_image_url: finalCoverImage, // Use the final URL determined above
      page_count: currentBook.page_count,
      location: currentBook.location,
      availability_status: currentBook.availability_status,
      edition: currentBook.edition,
      quantity: currentBook.quantity,
      rating: currentBook.rating,
      tags: currentBook.tags,
      price: currentBook.price,
      book_format: currentBook.book_format,
    };
    console.log("Updated book data:", updatedBookData);
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }

    const token = userToken;
    try {
      const response = await axios.put(
       `${BASE_URL}/books/${currentBook.id}`,  // Use the current book's ID for the PUT request
        updatedBookData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Book updated:', response.data);
      setSnackbarMessage('Book updated successfully!');
      setSnackbarSeverity('success');
      onDataChange();
      setSnackbarOpen(true);
      setOpenDialog(false);
      setCurrentBook(null);
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = 'Failed to update book.';
    
        if (errorData && errorData.message) {
          // Map through each error field to get a readable message
          errorMessage = Object.keys(errorData.message)
            .map(field => `${field.charAt(0).toUpperCase() + field.slice(1)}: ${errorData.message[field].join(', ')}`)
            .join(' | ');
        }
        console.error('Failed to update book:', errorData);
        setSnackbarMessage(errorMessage);
      } else {
        console.error('Failed to update book:', error);
        setSnackbarMessage('Failed to update book.');
      }
    
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    
  };
  

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <IconButton onClick={handleAddClick} color="primary">
          <Add />
        </IconButton>
        <IconButton
          onClick={handleDeleteClick}
          color="secondary"
          disabled={selectedBooks.length === 0}
        >
          <Delete />
        </IconButton>
        <IconButton
    onClick={handleEditClick}
    color="primary"
    disabled={selectedBooks.length !== 1}
  >
    <Edit />
  </IconButton>
      </Box>

      <TableContainer sx={{ width: '100%', overflowX: 'auto', maxHeight: '500px',   overflowY: 'auto' }}>
  <Table aria-labelledby="tableTitle">
    <BooksTableHead />
    <TableBody>
      {books.map((book) => (
        <TableRow key={book.id}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedBooks.includes(book.id)}
              onChange={(e) => handleCheckboxChange(e, book.id)}
            />
          </TableCell>
          <TableCell component="th" scope="row">
            <Link color="secondary">{book.id}</Link>
          </TableCell>
          <TableCell>
        <img 
          src={book.cover_image_url ? book.cover_image_url : 'https://placehold.co/600x400/png'} 
          alt={book.title || 'No cover available'} 
          width={50} 
          height={70} 
        />
      </TableCell>
          <TableCell>{book.title}</TableCell>
          <TableCell>{book.author}</TableCell>
          <TableCell>{book.publisher}</TableCell>
          <TableCell>{book.publication_date}</TableCell>
          <TableCell>{book.genre}</TableCell>
          <TableCell>{book.language}</TableCell>
          <TableCell
  sx={{
    maxWidth: 200,  // Limit the width of the description column
    whiteSpace: 'nowrap', // Prevent text wrapping
    overflow: 'hidden', // Hide overflow text
    textOverflow: 'ellipsis', // Add ellipsis (...) for overflow text
  }}
  onClick={() => alert(book.description)}  // Show in a pop-up
>
  {book.description}
</TableCell>
          <TableCell>{book.availability_status}</TableCell>
          <TableCell>{book.location}</TableCell>
          <TableCell>{book.page_count}</TableCell>
          <TableCell>{book.isbn}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>



      {/* Dialog for Adding / Editing Book */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>{editMode ? 'Edit Book' : 'Add New Book'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ paddingTop: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              fullWidth
              value={currentBook?.title || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Author"
              fullWidth
              value={currentBook?.author || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, author: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Publisher"
              fullWidth
              value={currentBook?.publisher || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, publisher: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Publication Date"
              type="date"
              value={currentBook?.publication_date || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, publication_date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Genre"
              fullWidth
              value={currentBook?.genre || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, genre: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={currentBook?.language || ''}
                onChange={(e) => setCurrentBook({ ...currentBook, language: e.target.value })}
                label="Language"
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={currentBook?.description || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Availability Status</InputLabel>
              <Select
                value={currentBook?.availability_status || ''}
                onChange={(e) => setCurrentBook({ ...currentBook, availability_status: e.target.value })}
                label="Availability Status"
              >
                {availabilityStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={currentBook?.location || ''}
                onChange={(e) => setCurrentBook({ ...currentBook, location: e.target.value })}
                label="Location"
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Page Count"
              fullWidth
              type="number"
              value={currentBook?.page_count || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, page_count: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ISBN"
              fullWidth
              value={currentBook?.isbn || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, isbn: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Edition"
              fullWidth
              value={currentBook?.edition || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, edition: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity"
              fullWidth
              type="number"
              value={currentBook?.quantity || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, quantity: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Rating"
              fullWidth
              type="number"
              value={currentBook?.rating || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, rating: e.target.value })}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              fullWidth
              type="number"
              value={currentBook?.price || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, price: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={currentBook?.book_format || ''}
                onChange={(e) => setCurrentBook({ ...currentBook, book_format: e.target.value })}
                label="Format"
              >
                {formats.map((format) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tags"
              fullWidth
              value={currentBook?.tags?.join(', ') || ''}
              onChange={(e) => setCurrentBook({ ...currentBook, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              helperText="Enter tags separated by commas"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Cover Image</Typography>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {coverImage && <img src={coverImage} alt="Cover Preview" width={100} height={130} />}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={
          editMode ? handleUpdateBook : handleSaveBook} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
    <CustomSnackbar
  open={snackbarOpen}
  message={snackbarMessage}
  onClose={() => setSnackbarOpen(false)}
  severity={snackbarSeverity}
/>

    </Box>
  );
}

BooksTable.propTypes = {
  books: PropTypes.array.isRequired,
  onDataChange: PropTypes.func.isRequired,

};
export default BooksTable;
