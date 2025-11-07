// BookManagementPage.js - Fetches and manages its own data from the API
import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function BookManagementPage() {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newBookData, setNewBookData] = useState({ id: '', title: '', author: '', genre: '', copies: 0 });
  const [editingBook, setEditingBook] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookToDeleteId, setBookToDeleteId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/books')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error("Error fetching books:", error));
  }, []);

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
    setNewBookData({ id: book.id, title: book.title, author: book.author, genre: book.genre, copies: book.copies });
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
    const url = editingBook ? `http://localhost:8080/api/books/${editingBook.id}` : 'http://localhost:8080/api/books';
    const method = editingBook ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookData),
      });
      const savedBook = await response.json();

      if (editingBook) {
        setBooks(prevBooks => prevBooks.map(book => (book.id === editingBook.id ? savedBook : book)));
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
      await fetch(`http://localhost:8080/api/books/${bookToDeleteId}`, { method: 'DELETE' });
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookToDeleteId));
      handleCloseConfirm();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ISBN', width: 150 },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'author', headerName: 'Author', width: 200 },
    { field: 'genre', headerName: 'Genre', width: 150 },
    { field: 'copies', headerName: 'Copies Available', type: 'number', width: 150 },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}><DeleteIcon color="error" /></IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Book Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>Add New Book</Button>
      </Box>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={books} columns={columns} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingBook ? 'Edit Book' : 'Add a New Book'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="isbn" label="ISBN" type="text" fullWidth variant="outlined" value={newBookData.id} onChange={handleInputChange} disabled={!!editingBook} />
          <TextField margin="dense" name="title" label="Title" type="text" fullWidth variant="outlined" value={newBookData.title} onChange={handleInputChange} />
          <TextField margin="dense" name="author" label="Author" type="text" fullWidth variant="outlined" value={newBookData.author} onChange={handleInputChange} />
          <TextField margin="dense" name="genre" label="Genre" type="text" fullWidth variant="outlined" value={newBookData.genre} onChange={handleInputChange} />
          <TextField margin="dense" name="copies" label="Copies Available" type="number" fullWidth variant="outlined" value={newBookData.copies} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>{editingBook ? 'Save Changes' : 'Add Book'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete this book? This action cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookManagementPage;