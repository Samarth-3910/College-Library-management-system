// IssueBookModal.js - Modal for Issuing Books with QR Scanner
import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QRScannerModal from './QRScannerModal';

function IssueBookModal({ open, onClose, books, students, onIssueConfirm }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [onScan, setOnScan] = useState(() => () => {});

  const availableBooks = useMemo(
    () => books.filter(book => book.copies > 0),
    [books]
  );

  const handleStudentScan = (scannedId) => {
    const foundStudent = students.find(s => s.id === scannedId);
    if (foundStudent) {
      setSelectedStudent(foundStudent);
    } else {
      alert(`Student ID "${scannedId}" not found in the system.`);
    }
  };

  const handleBookScan = (scannedId) => {
    const bookInSystem = books.find(b => b.id === scannedId);

    if (!bookInSystem) {
      alert(`Book with ISBN "${scannedId}" does not exist in the system.`);
      return;
    }

    if (bookInSystem.copies > 0) {
      setSelectedBook(bookInSystem);
    } else {
      alert(`The book "${bookInSystem.title}" is currently out of stock and cannot be issued.`);
    }
  };

  const startScan = (handler) => {
    setOnScan(() => handler);
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
    
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Issue a New Book</DialogTitle>
        <DialogContent>
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
          <Button onClick={handleConfirm} variant="contained" disabled={!selectedStudent || !selectedBook}>
            Confirm Issue
          </Button>
        </DialogActions>
      </Dialog>

      <QRScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onResult={onScan}
      />
    </>
  );
}

export default IssueBookModal;