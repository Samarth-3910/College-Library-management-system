// src/components/BookManagementPage.js
import React, { useState } from 'react';

import { Typography, Box, Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; 
import AddIcon from '@mui/icons-material/Add';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

// STEP 2: Create some mock data.
// In a real app, you would fetch this from an API.
// IMPORTANT: Each object MUST have a unique `id` property. DataGrid uses this.

function BookManagementPage({ books, setBooks }) {
  const [open, setOpen] = useState(false);
  const [newBookData, setNewBookData] = useState({
      isbn: '',
      title: '',
      author: '',
      genre: '',
      copies: 0,
  });
  const [editingBook, setEditingBook] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookToDeleteId, setBookToDeleteId] = useState(null);

  // Function to open the modal
  const handleClickOpen = () => {
      setEditingBook(null); // Make sure we are in "add" mode
      setNewBookData({      // Clear the form for the new entry
          isbn: '',
          title: '',
          author: '',
          genre: '',
          copies: 0,
      });
      setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
      setOpen(false);
      setEditingBook(null);
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewBookData({
          ...newBookData, // Copy the existing state
          [name]: value,  // Update the specific field that changed
      });
  };

  const handleEditClick = (book) => {
      setEditingBook(book); // Remember which book we are editing
      setNewBookData({      // Pre-fill the form with its data
          isbn: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          copies: book.copies,
      });
      setOpen(true); // Open the modal
  };

  const handleDeleteClick = (bookId) => {
      setBookToDeleteId(bookId);
      setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
      setConfirmOpen(false);      // Close the dialog
      setBookToDeleteId(null);    // Clear the stored ID
  };

  const handleConfirmDelete = () => {
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookToDeleteId));
      handleCloseConfirm();
  };

  const handleFormSubmit = () => {
       if (editingBook) {
      // --- UPDATE LOGIC ---
      setBooks(prevBooks =>
          prevBooks.map(book =>
              book.id === editingBook.id
                  ? { ...book, ...newBookData, id: newBookData.isbn }
                  : book
          )
      );
  } else {
      const bookToAdd = {
          id: newBookData.isbn,
          title: newBookData.title,
          author: newBookData.author,
          genre: newBookData.genre,
          copies: parseInt(newBookData.copies, 10),
      };

      setBooks(prevBooks => [...prevBooks, bookToAdd]);
    }
      setNewBookData({ isbn: '', title: '', author: '', genre: '', copies: 0 });
      handleClose();
  };

  const columns = [
    { field: 'id', headerName: 'ISBN', width: 150 },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'author', headerName: 'Author', width: 200 },
    { field: 'genre', headerName: 'Genre', width: 150 },
    { field: 'copies', headerName: 'Copies Available', type: 'number', width: 150 },

    {
          field: 'actions',
          headerName: 'Actions',
          width: 150,
          sortable: false, // Actions column shouldn't be sortable
          renderCell: (params) => {
              // `params.row` contains the data for the entire row
              return (
                  <>
                      <IconButton onClick={() => handleEditClick(params.row)}>
                          <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(params.row.id)}>
                          <DeleteIcon color="error" />
                      </IconButton>
                  </>
              );
          },
      },
  ];

  return (
    <Box>
        {/* PAGE HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom>
                Book Management
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
                Add New Book
            </Button>
        </Box>

        {/* THE DATA GRID */}
        <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
            rows={books}
            columns={columns}
            pageSizeOptions={[10, 25]} // Options for how many rows to show per page
            disableRowSelectionOnClick // Prevents selecting a row when you click it
        />
        </Paper>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add a New Book'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="isbn"
                    label="ISBN"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newBookData.isbn}
                    onChange={handleInputChange}
                    disabled={!!editingBook}
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
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleFormSubmit}>
                  {editingBook ? 'Save Changes' : 'Add Book'}
                </Button>
            </DialogActions>
        </Dialog>
        
        <Dialog
            open={confirmOpen}
            onClose={handleCloseConfirm}
        >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this book? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirm}>Cancel</Button>
                <Button onClick={handleConfirmDelete} color="error" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
}

export default BookManagementPage;