import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography, Box, Paper, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, IconButton, Grid, Card, CardContent, CardActions,
    Chip, Avatar, ToggleButtonGroup, ToggleButton, InputAdornment, Select,
    MenuItem, FormControl, InputLabel, Fab, Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import BookIcon from '@mui/icons-material/Book';
import DownloadIcon from '@mui/icons-material/Download';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
}));

const BookCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '15px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    }
}));

const BookCover = styled(Box)(({ theme }) => ({
    height: 200,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '80px',
    color: 'white',
    borderRadius: '15px 15px 0 0',
}));

const FilterChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    borderRadius: '10px',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 'bold',
}));

function BookManagementPage() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [open, setOpen] = useState(false);
    const [newBookData, setNewBookData] = useState({
        id: '', title: '', author: '', genre: '', copies: 0
    });
    const [editingBook, setEditingBook] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [bookToDeleteId, setBookToDeleteId] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/books');
            const data = await response.json();
            setBooks(data);
            setFilteredBooks(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // Get unique genres for filter
    const genres = useMemo(() => {
        const uniqueGenres = [...new Set(books.map(book => book.genre))];
        return uniqueGenres.filter(genre => genre);
    }, [books]);

    // Apply filters
    useEffect(() => {
        let filtered = books;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Genre filter
        if (genreFilter !== 'all') {
            filtered = filtered.filter(book => book.genre === genreFilter);
        }

        // Availability filter
        if (availabilityFilter === 'available') {
            filtered = filtered.filter(book => book.copies > 0);
        } else if (availabilityFilter === 'unavailable') {
            filtered = filtered.filter(book => book.copies === 0);
        }

        setFilteredBooks(filtered);
    }, [searchTerm, genreFilter, availabilityFilter, books]);

    const clearFilters = () => {
        setSearchTerm('');
        setGenreFilter('all');
        setAvailabilityFilter('all');
    };

    const hasActiveFilters = searchTerm || genreFilter !== 'all' || availabilityFilter !== 'all';

    const handleClickOpen = () => {
        setEditingBook(null);
        setNewBookData({ id: '', title: '', author: '', genre: '', copies: 0 });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingBook(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const key = name === 'isbn' ? 'id' : name;
        setNewBookData({ ...newBookData, [key]: value });
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
        setNewBookData({
            id: book.id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            copies: book.copies
        });
        setOpen(true);
    };

    const handleDeleteClick = (bookId) => {
        setBookToDeleteId(bookId);
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
        setBookToDeleteId(null);
    };

    const handleFormSubmit = async () => {
        const url = editingBook
            ? `http://localhost:8080/api/books/${editingBook.id}`
            : 'http://localhost:8080/api/books';
        const method = editingBook ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBookData),
            });
            const savedBook = await response.json();

            if (editingBook) {
                setBooks(prevBooks =>
                    prevBooks.map(book => (book.id === editingBook.id ? savedBook : book))
                );
            } else {
                setBooks(prevBooks => [...prevBooks, savedBook]);
            }
            handleClose();
        } catch (error) {
            console.error("Error saving book:", error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await fetch(`http://localhost:8080/api/books/${bookToDeleteId}`, {
                method: 'DELETE'
            });
            setBooks(prevBooks => prevBooks.filter(book => book.id !== bookToDeleteId));
            handleCloseConfirm();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const exportToCSV = () => {
        const headers = ['ISBN', 'Title', 'Author', 'Genre', 'Copies'];
        const csvData = filteredBooks.map(book => [
            book.id,
            book.title,
            book.author,
            book.genre,
            book.copies
        ]);

        const csv = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'books_export.csv';
        a.click();
    };

    const columns = [
        { field: 'id', headerName: 'ISBN', width: 150 },
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
        { field: 'author', headerName: 'Author', flex: 1, minWidth: 150 },
        { field: 'genre', headerName: 'Genre', width: 130 },
        {
            field: 'copies',
            headerName: 'Available',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value > 0 ? 'success' : 'error'}
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleEditClick(params.row)} size="small">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row.id)} size="small">
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                    Book Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your library collection
                </Typography>
            </Box>

            {/* Toolbar */}
            <StyledPaper sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Search */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search by title, author, or ISBN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Genre Filter */}
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Genre</InputLabel>
                            <Select
                                value={genreFilter}
                                label="Genre"
                                onChange={(e) => setGenreFilter(e.target.value)}
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
                        <FormControl fullWidth size="small">
                            <InputLabel>Availability</InputLabel>
                            <Select
                                value={availabilityFilter}
                                label="Availability"
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Books</MenuItem>
                                <MenuItem value="available">Available</MenuItem>
                                <MenuItem value="unavailable">Unavailable</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            {hasActiveFilters && (
                                <ActionButton
                                    variant="outlined"
                                    startIcon={<ClearIcon />}
                                    onClick={clearFilters}
                                >
                                    Clear
                                </ActionButton>
                            )}
                            <ActionButton
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={exportToCSV}
                            >
                                Export
                            </ActionButton>
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                                size="small"
                            >
                                <ToggleButton value="grid">
                                    <ViewModuleIcon />
                                </ToggleButton>
                                <ToggleButton value="table">
                                    <ViewListIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                </Grid>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                            Active filters:
                        </Typography>
                        {searchTerm && (
                            <FilterChip
                                label={`Search: "${searchTerm}"`}
                                onDelete={() => setSearchTerm('')}
                                size="small"
                            />
                        )}
                        {genreFilter !== 'all' && (
                            <FilterChip
                                label={`Genre: ${genreFilter}`}
                                onDelete={() => setGenreFilter('all')}
                                size="small"
                            />
                        )}
                        {availabilityFilter !== 'all' && (
                            <FilterChip
                                label={`${availabilityFilter === 'available' ? 'Available Only' : 'Unavailable Only'}`}
                                onDelete={() => setAvailabilityFilter('all')}
                                size="small"
                            />
                        )}
                    </Box>
                )}
            </StyledPaper>

            {/* Results Count */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {filteredBooks.length} of {books.length} books
                </Typography>
            </Box>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <Grid container spacing={3}>
                    {filteredBooks.map((book) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                            <BookCard>
                                <BookCover>
                                    <BookIcon sx={{ fontSize: 80 }} />
                                </BookCover>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        by {book.author}
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Chip
                                            label={book.genre}
                                            size="small"
                                            variant="outlined"
                                            sx={{ mr: 1 }}
                                        />
                                        <Chip
                                            label={`${book.copies} available`}
                                            size="small"
                                            color={book.copies > 0 ? 'success' : 'error'}
                                        />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        ISBN: {book.id}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <ActionButton
                                        size="small"
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditClick(book)}
                                    >
                                        Edit
                                    </ActionButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(book.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </BookCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <StyledPaper>
                    <div style={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={filteredBooks}
                            columns={columns}
                            pageSize={10}
                            pageSizeOptions={[10, 25, 50]}
                            disableRowSelectionOnClick
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-cell:focus': {
                                    outline: 'none'
                                }
                            }}
                        />
                    </div>
                </StyledPaper>
            )}

            {/* Floating Add Button */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}
            >
                <AddIcon />
            </Fab>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="isbn"
                        label="ISBN"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newBookData.id}
                        onChange={handleInputChange}
                        disabled={!!editingBook}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newBookData.title}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="author"
                        label="Author"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newBookData.author}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="genre"
                        label="Genre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newBookData.genre}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="copies"
                        label="Copies Available"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newBookData.copies}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <ActionButton onClick={handleClose} variant="outlined">
                        Cancel
                    </ActionButton>
                    <ActionButton onClick={handleFormSubmit} variant="contained">
                        {editingBook ? 'Save Changes' : 'Add Book'}
                    </ActionButton>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this book? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <ActionButton onClick={handleCloseConfirm} variant="outlined">
                        Cancel
                    </ActionButton>
                    <ActionButton onClick={handleConfirmDelete} variant="contained" color="error">
                        Delete
                    </ActionButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default BookManagementPage;