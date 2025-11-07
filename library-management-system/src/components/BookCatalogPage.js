// BookCatalogPage.js - Now fetches its own data from the API
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import AuthContext from '../context/AuthContext';

function BookCatalogPage() {
  const { currentUser } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, reservationsRes] = await Promise.all([
          fetch('http://localhost:8080/api/books'),
          fetch('http://localhost:8080/api/reservations'),
        ]);

        const booksData = await booksRes.json();
        const reservationsData = await reservationsRes.json();

        setBooks(Array.isArray(booksData) ? booksData : []);
        setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      } catch (error) {
        console.error("Failed to fetch catalog data:", error);
        setBooks([]);
        setReservations([]);
      }
    };
    fetchData();
  }, []);

  const handleReserve = async (bookId) => {
      console.log("1. handleReserve started for bookId:", bookId);

      if (!currentUser) {
          console.error("  -> FAILED: No current user is logged in.");
          return alert("Please log in to reserve a book.");
      }
      console.log("2. Current user is valid:", currentUser.id);

      const book = books.find(b => b.id === bookId);
      if (book && book.copies > 0) {
          console.error("  -> FAILED: Book has copies available.");
          return alert("This book is available. No need to reserve.");
      }
      console.log("3. Book is confirmed to have 0 copies.");

      const alreadyReserved = Array.isArray(reservations) && reservations.some(
          res => res.bookId === bookId && res.studentId === currentUser.id
      );

      if (alreadyReserved) {
          console.error("  -> FAILED: User has already reserved this book.");
          return alert("You have already reserved this book.");
      }
      console.log("4. User has not already reserved this book. Proceeding.");

      const newReservationData = {
          bookId: bookId,
          studentId: currentUser.id,
      };
      console.log("5. Prepared reservation data to send to backend:", newReservationData);

      try {
          console.log("6. Attempting to send fetch POST request to /api/reservations...");

          const response = await fetch('http://localhost:8080/api/reservations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newReservationData),
          });

          console.log("7. Fetch request completed. Response status:", response.status);

          if (!response.ok) {
              // This will help us see what the backend is saying if it's an error
              const errorText = await response.text();
              throw new Error(`Backend returned an error: ${response.status} ${errorText}`);
          }

          const savedReservation = await response.json();
          console.log("8. Successfully parsed JSON response from backend:", savedReservation);

          setReservations(prev => [...prev, savedReservation]);
          console.log("9. Local state updated.");

          alert("Book reserved successfully!");

      } catch (error) {
          // THIS IS THE MOST IMPORTANT PART FOR DEBUGGING
          console.error("  -> CRITICAL ERROR in fetch block:", error);
          alert("An error occurred while trying to reserve the book. Please check the console.");
      }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Book Catalog</Typography>
      <Grid container spacing={3}>
        {books.map((book) => {
            const isReservedByUser = (Array.isArray(reservations))
                ? reservations.some(res => res.bookId === book.id && res.studentId === currentUser?.id)
                : false;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">{book.title}</Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">by {book.author}</Typography>
                  <Chip label={book.genre} variant="outlined" size="small" />
                </CardContent>
                <CardActions>
                  {book.copies > 0 ? (
                    <Chip label={`Available (${book.copies})`} color="success" variant="filled" />
                  ) : (
                    <Button size="small" variant="contained" onClick={() => handleReserve(book.id)} disabled={isReservedByUser}>
                      {isReservedByUser ? 'Reserved' : 'Reserve'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default BookCatalogPage;