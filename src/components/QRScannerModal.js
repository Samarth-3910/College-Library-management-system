// src/components/QRScannerModal.js
import React from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';

function QRScannerModal({ open, onClose, onResult }) {
  const handleScan = (result, error) => {
    if (!!result) {
      onResult(result?.text); // Pass the scanned text back to the parent
      onClose(); // Close the modal on successful scan
    }
    if (!!error) {
      // You can handle errors here if you want
      console.info(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Scan QR Code</DialogTitle>
      <DialogContent>
        {open && ( // Only render the QrReader when the dialog is open to activate the camera
          <Box sx={{ width: '400px', height: '400px' }}>
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              style={{ width: '100%' }}
            />
          </Box>
        )}
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Point the camera at a QR code.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default QRScannerModal;