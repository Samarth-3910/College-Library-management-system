// QRScannerModal.js - Enhanced QR Code Scanner Component
import React from 'react';
import { QrReader } from 'react-qr-reader';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
  color: 'white',
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ScannerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 500,
  margin: '0 auto',
  borderRadius: 16,
  overflow: 'hidden',
  border: '4px solid #7b1fa2',
  boxShadow: '0 8px 24px rgba(123, 31, 162, 0.3)',
}));

const ScannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '70%',
    border: '3px solid rgba(123, 31, 162, 0.5)',
    borderRadius: 16,
    animation: 'pulse 2s ease-in-out infinite',
  },
}));

const InstructionBox = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2.5),
  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
  borderRadius: 12,
  border: '2px solid #9c27b0',
  textAlign: 'center',
}));

function QRScannerModal({ open, onClose, onResult }) {
  const handleScan = (result, error) => {
    if (!!result) {
      onResult(result?.text);
      onClose();
    }
    if (!!error) {
      console.info(error);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <QrCodeScannerIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>
              Scan QR Code
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Position the QR code within the frame
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'rotate(90deg)',
              transition: 'all 0.3s ease',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {open && (
          <ScannerContainer>
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              style={{ width: '100%' }}
            />
            <ScannerOverlay>
              <CenterFocusStrongIcon
                sx={{
                  fontSize: 80,
                  color: 'rgba(123, 31, 162, 0.3)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            </ScannerOverlay>
          </ScannerContainer>
        )}

        <InstructionBox elevation={0}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#7b1fa2', mb: 1 }}>
            How to Scan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            1. Allow camera access when prompted<br />
            2. Hold the QR code steady within the frame<br />
            3. Wait for automatic detection
          </Typography>
        </InstructionBox>
      </DialogContent>
    </StyledDialog>
  );
}

export default QRScannerModal;