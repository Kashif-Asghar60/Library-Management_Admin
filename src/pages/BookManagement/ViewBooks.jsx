import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Card, CardMedia, CardContent, Typography, Dialog, DialogContent, DialogTitle, Box, Button
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import CardWrapper from 'components/CardWrapper';
import BooksTable from './BooksTable';
import CustomSnackbar from 'components/CustomSnackbar';
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
 // const token = '4|4LaUb5B4Ga310o9oKDjodnVRBDgRnnbL1I244p4b21c4060d';
  const { isLoggedIn, userToken } = useAuth();
  const fetchBooks = async () => {
    if (!userToken) {
      console.log('No token available');
      return; // Return early if no token is available
    }

    const token = userToken;
    try {
      const response = await axios.get(`${BASE_URL}/books`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      if (error.response && error.response.status === 401) {
        setSnackbarMessage('Unauthorized: Please log in to access this resource.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  // Fetch books from the API
  useEffect(() => {
   
    fetchBooks();
  }, []);

  // Function to handle refetching from the child
const handleDataChange = () => {
  fetchBooks();
};
  // Handle opening book dialog
  const handleOpenDialog = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDialog = () => {
    setSelectedBook(null);
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div>
      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 2,
      }}>
        <Button onClick={handleEditToggle} variant="contained" color="primary" sx={{ ml: 2 }}>
          {isEditMode ? 'Cancel Edit' : 'Edit'}
        </Button>

        <FormControl sx={{ width: 300 }}>
          <OutlinedInput
            size="small"
            startAdornment={
              <InputAdornment position="start" sx={{ mr: -0.5 }}>
                <SearchOutlined />
              </InputAdornment>
            }
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
      </Box>

      <CardWrapper>
        {isEditMode ? (
          <Card>
  <BooksTable books={books} onDataChange={handleDataChange} />
  </Card>
        ) : (
          <Grid container spacing={3} sx={{ padding: 2, justifyContent: 'center' }}>
            {books.map((book) => (
              <Grid item key={book.id} sx={{ maxWidth: 160, flex: '1 0 160px' }}>
                <Card onClick={() => handleOpenDialog(book)} sx={{ cursor: 'pointer', width: '100%', height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={book.cover_image_url}
                    alt={book.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    <Typography variant="h6">{book.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardWrapper>

      {selectedBook && (
        <Dialog open={Boolean(selectedBook)} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{selectedBook.title}</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="row" gap={3}>
              <Box sx={{ width: '40%', maxHeight: '300px', display: 'flex', alignItems: 'center' }}>
                <img
                  src={selectedBook.cover_image_url}
                  alt={selectedBook.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                    borderRadius: '8px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box sx={{ width: '60%' }}>
                <Typography variant="body1"><strong>Author:</strong> {selectedBook.author}</Typography>
                <Typography variant="body1"><strong>Publisher:</strong> {selectedBook.publisher}</Typography>
                <Typography variant="body1"><strong>Publication Date:</strong> {selectedBook.publication_date}</Typography>
                <Typography variant="body1"><strong>ISBN:</strong> {selectedBook.isbn}</Typography>
                <Typography variant="body1"><strong>Genre:</strong> {selectedBook.genre}</Typography>
                <Typography variant="body1"><strong>Language:</strong> {selectedBook.language}</Typography>
                <Typography variant="body1"><strong>Pages:</strong> {selectedBook.page_count}</Typography>
                <Typography variant="body1"><strong>Location:</strong> {selectedBook.location}</Typography>
                <Typography variant="body1"><strong>Availability:</strong> {selectedBook.availability_status}</Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ marginTop: 2 }}><strong>Description:</strong> {selectedBook.description}</Typography>
          </DialogContent>
        </Dialog>
      )}

<CustomSnackbar
  open={snackbarOpen}
  message={snackbarMessage}
  onClose={() => setSnackbarOpen(false)}
  severity={snackbarSeverity}
/>
    </div>
  );
};

export default ViewBooks;
