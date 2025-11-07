// ReturnBookModal.js - Modal for Returning Books with Fine Calculation
import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField, Box, Typography, Alert } from '@mui/material';

const FINE_PER_DAY = 0.50;

function ReturnBookModal({ open, onClose, transactions, reservations, students, onReturnConfirm }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const issuedBooks = useMemo(
    () => transactions.filter(t => t.returnDate === null),
    [transactions]
  );

  const fineInfo = useMemo(() => {
    if (!selectedTransaction) return { daysOverdue: 0, fine: 0 };

    const today = new Date();
    const dueDate = new Date(selectedTransaction.dueDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (today <= dueDate) return { daysOverdue: 0, fine: 0 };

    const diffTime = today.getTime() - dueDate.getTime();
    const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const fine = daysOverdue * FINE_PER_DAY;

    return { daysOverdue, fine };
  }, [selectedTransaction]);

  const nextReservation = useMemo(() => {
    if (!selectedTransaction) return null;

    const validReservations = Array.isArray(reservations) ? reservations : [];

    const queue = validReservations
      .filter(res => res.bookId === selectedTransaction.bookId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (queue.length > 0) {
      const nextStudent = students.find(s => s.id === queue[0].studentId);
      return {
        reservationId: queue[0].id,
        studentName: nextStudent ? nextStudent.name : 'Unknown Student',
      };
    }
    return null;
  }, [selectedTransaction, reservations, students]);

  const handleConfirm = () => {
    if (selectedTransaction) {
      const reservationId = nextReservation ? nextReservation.reservationId : null;
      onReturnConfirm(selectedTransaction, fineInfo.fine, reservationId);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedTransaction(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Return a Book</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={issuedBooks}
          getOptionLabel={(option) => `${option.bookTitle} (Borrowed by: ${option.studentName})`}
          value={selectedTransaction}
          onChange={(event, newValue) => setSelectedTransaction(newValue)}
          renderInput={(params) => <TextField {...params} label="Search for Issued Book" margin="normal" />}
        />
        {selectedTransaction && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6">Return Details</Typography>
            <Typography>Book: <strong>{selectedTransaction.bookTitle}</strong></Typography>
            <Typography>Student: <strong>{selectedTransaction.studentName}</strong></Typography>
            <Typography>Due Date: <strong>{new Date(selectedTransaction.dueDate).toLocaleDateString()}</strong></Typography>
            
            {fineInfo.fine > 0 && (
              <Typography color="error.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                Fine Due: ${fineInfo.fine.toFixed(2)} ({fineInfo.daysOverdue} days overdue)
              </Typography>
            )}
            {nextReservation && (
              <Alert severity="info" sx={{ mt: 2 }}>
                This book has a reservation pending for <strong>{nextReservation.studentName}</strong>.
                Please set it aside and do not return it to the main shelf.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!selectedTransaction}>
          Confirm Return
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReturnBookModal;