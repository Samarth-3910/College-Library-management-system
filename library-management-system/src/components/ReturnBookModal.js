// ReturnBookModal.js - Enhanced Modal for Returning Books with Fine Calculation
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Box,
  Typography,
  Alert,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const FINE_PER_DAY = 0.50;

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)',
  color: 'white',
  padding: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1976d2, #7b1fa2)',
  },
}));

const DetailBox = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)',
  borderRadius: 16,
  border: '2px solid #00897b',
  animation: 'slideUp 0.3s ease-out',
}));

const FineBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2.5),
  background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
  borderRadius: 12,
  border: '2px solid #ed6c02',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
  },
}));

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
    <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <StyledDialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssignmentReturnIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>
              Return a Book
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Process book returns and calculate fines
            </Typography>
          </Box>
        </Box>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Autocomplete
          options={issuedBooks}
          getOptionLabel={(option) => `${option.bookTitle} (Borrowed by: ${option.studentName})`}
          value={selectedTransaction}
          onChange={(event, newValue) => setSelectedTransaction(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for Issued Book"
              placeholder="Type book title or student name..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          )}
        />

        {selectedTransaction && (
          <DetailBox elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InfoIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00897b' }}>
                Return Details
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">Book:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedTransaction.bookTitle}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">Student:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedTransaction.studentName}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">Due Date:</Typography>
                <Chip
                  label={new Date(selectedTransaction.dueDate).toLocaleDateString()}
                  color={fineInfo.fine > 0 ? 'error' : 'success'}
                  icon={fineInfo.fine > 0 ? <WarningAmberIcon /> : <CheckCircleIcon />}
                />
              </Box>
            </Box>

            {fineInfo.fine > 0 && (
              <FineBox>
                <AttachMoneyIcon sx={{ fontSize: 40, color: '#ed6c02' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                    ${fineInfo.fine.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fine Due ({fineInfo.daysOverdue} days overdue @ ${FINE_PER_DAY}/day)
                  </Typography>
                </Box>
              </FineBox>
            )}

            {fineInfo.fine === 0 && (
              <Alert
                severity="success"
                sx={{ mt: 2, borderRadius: 2 }}
                icon={<CheckCircleIcon />}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  No fine! Book returned on time.
                </Typography>
              </Alert>
            )}

            {nextReservation && (
              <Alert
                severity="info"
                sx={{ mt: 2, borderRadius: 2 }}
                icon={<InfoIcon />}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Reservation Pending
                </Typography>
                <Typography variant="body2">
                  This book is reserved for <strong>{nextReservation.studentName}</strong>.
                  Please set it aside and do not return it to the main shelf.
                </Typography>
              </Alert>
            )}
          </DetailBox>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2, backgroundColor: '#f5f7fa' }}>
        <ActionButton
          onClick={handleClose}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </ActionButton>
        <ActionButton
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedTransaction}
          sx={{
            background: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)',
            '&:disabled': {
              background: '#e0e0e0',
            },
          }}
        >
          Confirm Return
        </ActionButton>
      </DialogActions>
    </StyledDialog>
  );
}

export default ReturnBookModal;