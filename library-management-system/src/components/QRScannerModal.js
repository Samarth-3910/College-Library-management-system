
// QRScannerModal.js - QR Code Scanner Component
import React from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Scan QR Code</DialogTitle>
      <DialogContent>
        {open && (
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