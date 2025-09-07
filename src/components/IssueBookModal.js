import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QRScannerModal from './QRScannerModal';

function IssueBookModal({ open, onClose, books, students, onIssueConfirm }) {
    // State for the selected items in the form
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);

    // State to control the scanner modal's visibility
    const [scannerOpen, setScannerOpen] = useState(false);

    // State to hold the correct handler function for the scanner.
    // This is the key to solving the bug.
    const [onScan, setOnScan] = useState(() => () => {}); // A function that does nothing by default

    // Memoized list of books that are currently available to be issued
    const availableBooks = useMemo(
        () => books.filter(book => book.copies > 0),
        [books]
    );

    // Specific handler for when a student QR code is successfully scanned
    const handleStudentScan = (scannedId) => {
        const foundStudent = students.find(s => s.id === scannedId);
        if (foundStudent) {
            setSelectedStudent(foundStudent);
        } else {
            alert(`Student ID "${scannedId}" not found in the system.`);
        }
    };

    // Specific handler for when a book QR code is successfully scanned
    const handleBookScan = (scannedId) => {
        const bookInSystem = books.find(b => b.id === scannedId);

        if (!bookInSystem) {
            alert(`Book with ISBN "${scannedId}" does not exist in the system.`);
            return;
        }

        if (bookInSystem.copies > 0) {
            // The Autocomplete component needs the full object to display correctly
            setSelectedBook(bookInSystem);
        } else {
            alert(`The book "${bookInSystem.title}" is currently out of stock and cannot be issued.`);
        }
    };

    // This function sets the correct handler and then opens the scanner
    const startScan = (handler) => {
        setOnScan(() => handler); // Set the function to be used by the scanner's onResult
        setScannerOpen(true);
    };

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
    
    // Calculate due date for display
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Issue a New Book</DialogTitle>
                <DialogContent>
                    {/* Student Autocomplete with Scanner Button */}
                    <Autocomplete
                        options={students}
                        getOptionLabel={(option) => `${option.name} (${option.id})`}
                        value={selectedStudent}
                        onChange={(event, newValue) => setSelectedStudent(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search or Scan for Student"
                                margin="normal"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => startScan(handleStudentScan)}>
                                                <QrCodeScannerIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    {/* Book Autocomplete with Scanner Button */}
                    <Autocomplete
                        options={availableBooks}
                        getOptionLabel={(option) => `${option.title} by ${option.author}`}
                        value={selectedBook}
                        onChange={(event, newValue) => setSelectedBook(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search or Scan for Available Book"
                                margin="normal"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => startScan(handleBookScan)}>
                                                <QrCodeScannerIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    {/* Confirmation Section */}
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

            {/* The Reusable QR Scanner Modal */}
            <QRScannerModal
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onResult={onScan} // Pass the currently active handler function
            />
        </>
    );
}

export default IssueBookModal;