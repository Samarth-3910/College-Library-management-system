import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField, Box, Typography } from '@mui/material';

function IssueBookModal({ open, onClose, books, students, onIssueConfirm }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);

    // useMemo will re-calculate this list only when the main `books` array changes.
    // This is an optimization that prevents re-filtering on every render.
    const availableBooks = useMemo(
        () => books.filter(book => book.copies > 0),
        [books]
    );

    const handleConfirm = () => {
        if (selectedStudent && selectedBook) {
            onIssueConfirm(selectedBook, selectedStudent);
            handleClose();
        }
    };

    const handleClose = () => {
        setSelectedStudent(null);
        setSelectedBook(null);
        onClose();
    };

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15); // Set due date 15 days from now

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Issue a New Book</DialogTitle>
            <DialogContent>
                <Autocomplete
                    options={students}
                    getOptionLabel={(option) => `${option.name} (${option.id})`}
                    value={selectedStudent}
                    onChange={(event, newValue) => setSelectedStudent(newValue)}
                    renderInput={(params) => <TextField {...params} label="Search for Student" margin="normal" />}
                />
                <Autocomplete
                    options={availableBooks}
                    getOptionLabel={(option) => `${option.title} by ${option.author}`}
                    value={selectedBook}
                    onChange={(event, newValue) => setSelectedBook(newValue)}
                    renderInput={(params) => <TextField {...params} label="Search for Available Book" margin="normal" />}
                />
                {selectedBook && selectedStudent && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="h6">Confirmation</Typography>
                        <Typography>Issue Book: <strong>{selectedBook.title}</strong></Typography>
                        <Typography>To Student: <strong>{selectedStudent.name}</strong></Typography>
                        <Typography>Due Date: <strong>{dueDate.toLocaleDateString()}</strong></Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!selectedStudent || !selectedBook}
                >
                    Confirm Issue
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default IssueBookModal;