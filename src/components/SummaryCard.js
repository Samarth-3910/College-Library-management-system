// src/components/SummaryCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

// We destructure the props right in the function signature for cleaner code
function SummaryCard({ title, value, icon }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{
          p: 2,
          mr: 2,
          backgroundColor: 'primary.main', // Uses the main theme color
          color: 'white',
          borderRadius: '50%', // Makes it a circle
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {icon}
      </Box>
      <Box>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </Box>
    </Card>
  );
}

export default SummaryCard;