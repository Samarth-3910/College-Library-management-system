// IssueBookModal.js - Enhanced Modal for Issuing Books with QR Scanner
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
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QRScannerModal from './QRScannerModal';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    overflow: 'visible',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
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
    background: 'linear-gradient(90deg, #00897b, #7b1fa2)',
  },
}));

const ConfirmationBox = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
  borderRadius: 16,
  border: '2px solid #1976d2',
  animation: 'slideUp 0.3s ease-out',
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

const ScanButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2, #00897b)',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565c0, #00695c)',
    transform: 'scale(1.1) rotate(5deg)',
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: theme.spacing(2, 1),
  height: 'auto',
}));

function IssueBookModal({ open, onClose, books, students, onIssueConfirm }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [onScan, setOnScan] = useState(() => () => { });
  const [activeStep, setActiveStep] = useState(0);

  const availableBooks = useMemo(
    () => books.filter(book => book.copies > 0),
    [books]
  );

  const handleStudentScan = (scannedId) => {
    const foundStudent = students.find(s => s.id === scannedId);
    if (foundStudent) {
      setSelectedStudent(foundStudent);
      setActiveStep(1);
    }
    // Silently ignore if student not found - might be scanning a book QR code
  };

  const handleBookScan = (scannedId) => {
    const bookInSystem = books.find(b => b.id === scannedId);

    if (!bookInSystem) {
      // Silently ignore if book not found - might be scanning a student QR code
      return;
    }

    if (bookInSystem.copies > 0) {
      setSelectedBook(bookInSystem);
      setActiveStep(2);
    }
    // Silently ignore if book is out of stock
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
    setActiveStep(0);
    onClose();
  };

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);

  const steps = ['Select Student', 'Select Book', 'Confirm'];

  return (
    <>
      <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <StyledDialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MenuBookIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>
                Issue a New Book
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Scan QR codes or search manually
              </Typography>
            </Box>
          </Box>
        </StyledDialogTitle>

        <DialogContent sx={{ p: 4 }}>
          {/* Progress Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Student Selection */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Student Information
              </Typography>
            </Box>
            <Autocomplete
              options={students}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              value={selectedStudent}
              onChange={(event, newValue) => {
                setSelectedStudent(newValue);
                if (newValue) setActiveStep(1);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search or Scan for Student"
                  placeholder="Type student name or ID..."
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <InputAdornment position="end">
                          <ScanButton
                            size="small"
                            onClick={() => startScan(handleStudentScan)}
                          >
                            <QrCodeScannerIcon />
                          </ScanButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              )}
            />
            {selectedStudent && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <InfoChip
                  icon={<CheckCircleIcon />}
                  label={`Selected: ${selectedStudent.name}`}
                  color="success"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Book Selection */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MenuBookIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Book Information
              </Typography>
            </Box>
            <Autocomplete
              options={availableBooks}
              getOptionLabel={(option) => `${option.title} by ${option.author}`}
              value={selectedBook}
              onChange={(event, newValue) => {
                setSelectedBook(newValue);
                if (newValue) setActiveStep(2);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search or Scan for Available Book"
                  placeholder="Type book title or author..."
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <InputAdornment position="end">
                          <ScanButton
                            size="small"
                            onClick={() => startScan(handleBookScan)}
                          >
                            <QrCodeScannerIcon />
                          </ScanButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              )}
            />
            {selectedBook && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <InfoChip
                  icon={<CheckCircleIcon />}
                  label={`Selected: ${selectedBook.title}`}
                  color="success"
                  variant="outlined"
                />
                <InfoChip
                  label={`${selectedBook.copies} copies available`}
                  color="info"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>

          {/* Confirmation Summary */}
          {selectedBook && selectedStudent && (
            <ConfirmationBox elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  Ready to Issue
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" color="text.secondary">Book:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedBook.title}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" color="text.secondary">Student:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedStudent.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" color="text.secondary">Due Date:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#ed6c02' }}>
                    {dueDate.toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </ConfirmationBox>
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
            disabled={!selectedStudent || !selectedBook}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #00897b 100%)',
              '&:disabled': {
                background: '#e0e0e0',
              },
            }}
          >
            Confirm Issue
          </ActionButton>
        </DialogActions>
      </StyledDialog>

      <QRScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onResult={onScan}
      />
    </>
  );
}

export default IssueBookModal;