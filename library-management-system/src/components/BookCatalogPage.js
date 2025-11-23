// BookCatalogPage.js - Enhanced Professional Book Catalog for Students
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AuthContext from '../context/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(3),
}));

const BookCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
}));

const BookCover = styled(Box)(({ theme }) => ({
  height: 200,
  background: 'linear-gradient(135deg, #1976d2 0%, #00897b 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: 8,
  padding: theme.spacing(0.5, 1),
}));

function BookCatalogPage() {
  const { currentUser } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

  // Get unique genres
  const genres = [...new Set(books.map(book => book.genre))].filter(Boolean);

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchTerm === '' ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;

    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && book.copies > 0) ||
      (availabilityFilter === 'unavailable' && book.copies === 0);

    return matchesSearch && matchesGenre && matchesAvailability;
  });

  const handleReserve = async (bookId) => {
    console.log("1. handleReserve started for bookId:", bookId);

    if (!currentUser) {
      console.error("  -> FAILED: No current user is logged in.");
      setSnackbar({ open: true, message: 'Please log in to reserve a book.', severity: 'error' });
      return;
    }
    console.log("2. Current user is valid:", currentUser.id);

    const book = books.find(b => b.id === bookId);
    if (book && book.copies > 0) {
      console.error("  -> FAILED: Book has copies available.");
      setSnackbar({ open: true, message: 'This book is available. No need to reserve.', severity: 'info' });
      return;
    }
    console.log("3. Book is confirmed to have 0 copies.");

    const alreadyReserved = Array.isArray(reservations) && reservations.some(
      res => res.bookId === bookId && res.studentId === currentUser.id
    );

    if (alreadyReserved) {
      console.error("  -> FAILED: User has already reserved this book.");
      setSnackbar({ open: true, message: 'You have already reserved this book.', severity: 'warning' });
      return;
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
        const errorText = await response.text();
        throw new Error(`Backend returned an error: ${response.status} ${errorText}`);
      }

      const savedReservation = await response.json();
      console.log("8. Successfully parsed JSON response from backend:", savedReservation);

      setReservations(prev => [...prev, savedReservation]);
      console.log("9. Local state updated.");

      setSnackbar({ open: true, message: 'Book reserved successfully!', severity: 'success' });

    } catch (error) {
      console.error("  -> CRITICAL ERROR in fetch block:", error);
      setSnackbar({ open: true, message: 'An error occurred while trying to reserve the book.', severity: 'error' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setGenreFilter('all');
    setAvailabilityFilter('all');
  };

  const hasActiveFilters = searchTerm || genreFilter !== 'all' || availabilityFilter !== 'all';

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1, fontFamily: 'Poppins' }}>
          Book Catalog
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse and reserve books from our collection
        </Typography>
      </Box>

      {/* Search and Filters */}
      <StyledPaper>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </Grid>

          {/* Genre Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genreFilter}
                label="Genre"
                onChange={(e) => setGenreFilter(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="all">All Genres</MenuItem>
                {genres.map(genre => (
                  <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Availability Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={availabilityFilter}
                label="Status"
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="all">All Books</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="unavailable">Unavailable</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters */}
          <Grid item xs={12} md={2}>
            {hasActiveFilters && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Clear Filters
              </Button>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Results Count */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredBooks.length} of {books.length} books
        </Typography>
      </Box>

      {/* Book Grid */}
      <Grid container spacing={3}>
        {filteredBooks.map((book) => {
          const isReservedByUser = (Array.isArray(reservations))
            ? reservations.some(res => res.bookId === book.id && res.studentId === currentUser?.id)
            : false;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <BookCard>
                {/* Book Cover */}
                <BookCover>
                  <BookIcon sx={{ fontSize: 80, color: 'white', zIndex: 1 }} />
                </BookCover>

                {/* Book Info */}
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {book.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    by {book.author}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={book.genre}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      label={`ISBN: ${book.id}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                </CardContent>

                <Divider />

                {/* Actions */}
                <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                  {book.copies > 0 ? (
                    <StatusChip
                      label={`${book.copies} Available`}
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{ flex: 1 }}
                    />
                  ) : (
                    <ActionButton
                      fullWidth
                      size="small"
                      variant="contained"
                      onClick={() => handleReserve(book.id)}
                      disabled={isReservedByUser}
                      startIcon={<BookmarkAddIcon />}
                      sx={{
                        background: isReservedByUser
                          ? '#e0e0e0'
                          : 'linear-gradient(135deg, #1976d2 0%, #00897b 100%)',
                        color: isReservedByUser ? '#666' : 'white',
                        '&:hover': {
                          background: isReservedByUser
                            ? '#e0e0e0'
                            : 'linear-gradient(135deg, #1565c0 0%, #00695c 100%)',
                        },
                      }}
                    >
                      {isReservedByUser ? 'Reserved' : 'Reserve Book'}
                    </ActionButton>
                  )}
                </CardActions>
              </BookCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)',
          }}
        >
          <BookIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BookCatalogPage;