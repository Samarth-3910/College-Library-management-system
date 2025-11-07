// QRCodeGeneratorPage.js - Fetches its own data for QR code generation
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';

// This is a reusable sub-component for displaying a grid of QR codes
function QRCodeGrid({ items, title, dataKey }) {
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const generateQRCodes = async () => {
      const urls = {};
      for (const item of items) {
        try {
          const url = await QRCode.toDataURL(item.id);
          urls[item.id] = url;
        } catch (err) {
          console.error(`Failed to generate QR code for item ${item.id}:`, err);
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
              ) : ( <p>Loading...</p> )}
              <Typography variant="caption" display="block">{item.id}</Typography>
              <Button
                variant="outlined" size="small"
                href={imageUrls[item.id]}
                download={`${title.replace(/\s+/g, '-').toLowerCase()}-${item.id}.png`}
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

// This is the main "page" component that gets exported and used in the router
export function QRCodeUtilityPage() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [booksRes, studentsRes] = await Promise.all([
                fetch('http://localhost:8080/api/books'),
                fetch('http://localhost:8080/api/students'),
            ]);
            setBooks(await booksRes.json());
            setStudents(await studentsRes.json());
        } catch (error) {
            console.error("Failed to fetch data for QR codes:", error);
        }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>QR Code Generation Utility</Typography>
      <QRCodeGrid items={students} title="Student IDs" dataKey="name" />
      <QRCodeGrid items={books} title="Book ISBNs" dataKey="title" />
    </Box>
  );
}