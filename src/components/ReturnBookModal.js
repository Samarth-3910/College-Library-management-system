import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField, Box, Typography } from '@mui/material';

function ReturnBookModal({ open, onClose, transactions, onReturnConfirm }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Filter transactions to find only those that are currently checked out
    const issuedBooks = useMemo(
        () => transactions.filter(t => t.returnDate === null),
        [transactions]
    );

    const handleConfirm = () => {
        if (selectedTransaction) {
            onReturnConfirm(selectedTransaction);
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
                        <Typography>
                            Due Date: <strong>{new Date(selectedTransaction.dueDate).toLocaleDateString()}</strong>
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!selectedTransaction}
                >
                    Confirm Return
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ReturnBookModal;