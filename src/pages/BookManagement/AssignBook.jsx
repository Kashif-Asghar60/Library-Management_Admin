// src/pages/BookManagement/AssignBook.js
import React, { useEffect, useState } from 'react';
import BookCopiesTable from './AssignBookCopiesTable'; // Assuming this is your component for rendering the table
import { useAuth } from '../../contexts/AuthContext'; 

import BASE_URL from '../../api/config'; 
const AssignBook = () => {
  const [bookCopies, setBookCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 // const token = '4|4LaUb5B4Ga310o9oKDjodnVRBDgRnnbL1I244p4b21c4060d';
 const { isLoggedIn, userToken } = useAuth();

  useEffect(() => {
    const fetchBookCopies = async () => {
      if (!userToken) {
        console.log('No token available');
        return; // Return early if no token is available
      }
  
      const token = userToken;
      try {
        const response = await fetch(`${BASE_URL}/book-copies`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch book copies');
        }
        
        const data = await response.json();
        setBookCopies(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookCopies();
  }, []);

  console.log('bookCopies in AssignBook:', bookCopies); // Debugging line

  if (loading) {
    return <p>Loading book copies...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <BookCopiesTable bookCopies={bookCopies} />
    </div>
  );
};

export default AssignBook;
