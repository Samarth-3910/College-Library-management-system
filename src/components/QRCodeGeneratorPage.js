// QRCodeGeneratorPage.js - QR Code Generation Utility
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';

function QRCodeGeneratorPage({ items, title, dataKey }) {
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const generateQRCodes = async () => {
      const urls = {};
      for (const item of items) {
        try {
          const url = await QRCode.toDataURL(item.id);
          urls[item.id] = url;
        } catch (err) {
          console.error('Failed to generate QR code for item:', item.id, err);
        }
      }
      setImageUrls(urls);
    };

    if (items.length > 0) {
      generateQRCodes();
    }
  }, [items]);

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item key={item.id} xs={6} sm={4} md={3} lg={2}>
            <Box sx={{ textAlign: 'center', border: '1px solid #ddd', p: 1 }}>
              <Typography variant="caption">{item[dataKey]}</Typography>
              {imageUrls[item.id] ? (
                <img src={imageUrls[item.id]} alt={`QR code for ${item.id}`} width="100%" />
              ) : (
                <p>Loading...</p>
              )}
              <Typography variant="caption" display="block">{item.id}</Typography>
              <Button
                variant="outlined"
                size="small"
                href={imageUrls[item.id]}
                download={`${title.toLowerCase()}-${item.id}.png`}
                sx={{ mt: 1 }}
                disabled={!imageUrls[item.id]}
              >
                Download
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export function QRCodeUtilityPage({ books, students }) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>QR Code Generation Utility</Typography>
      <QRCodeGeneratorPage items={students} title="Student IDs" dataKey="name" />
      <QRCodeGeneratorPage items={books} title="Book ISBNs" dataKey="title" />
    </Box>
  );
}