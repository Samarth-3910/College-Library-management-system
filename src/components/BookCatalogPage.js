// src/components/BookCatalogPage.js
import React, { useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import AuthContext from '../context/AuthContext';

function BookCatalogPage({ books, reservations, setReservations }) {
  // We'll add handleReserve logic later

  const { currentUser } = useContext(AuthContext);

  const handleReserve = (bookId) => {
    if (!currentUser) {
      alert("Please log in to reserve a book.");
      return;
    }


    const book = books.find(b => b.id === bookId);
    if (book && book.copies > 0) {
      alert("This book is available. No need to reserve.");
      return;
    }

    const alreadyReserved = reservations.some(
      (res) => res.bookId === bookId && res.studentId === currentUser.id
    );
    if (alreadyReserved) {
      alert("You have already reserved this book.");
      return;
    }

    const newReservation = {
      id: `R${Date.now()}`, // Simple unique ID
      bookId: bookId,
      studentId: currentUser.id,
      date: new Date().toISOString(),
    };

    setReservations((prevReservations) => [...prevReservations, newReservation]);
    alert("Book reserved successfully! You will be notified when it's available.");
    console.log("Current Reservations:", [...reservations, newReservation]);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Book Catalog
      </Typography>
      <Grid container spacing={3}>
        {books.map((book) => {
            const isReservedByUser = reservations.some(
                (res) => res.bookId === book.id && res.studentId === currentUser?.id
            );

            return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                  {book.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  by {book.author}
                </Typography>
                <Chip label={book.genre} variant="outlined" size="small" />
              </CardContent>
              <CardActions>
                {book.copies > 0 ? (
                  <Chip
                    label={`Available (${book.copies})`}
                    color="success"
                    variant="filled"
                  />
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleReserve(book.id)}
                    disabled={isReservedByUser}
                  >
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