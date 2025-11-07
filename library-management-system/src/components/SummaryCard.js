// SummaryCard.js - Dashboard Statistics Display
import React from 'react';
import { Card, Typography, Box } from '@mui/material';

function SummaryCard({ title, value, icon }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{
        p: 2,
        mr: 2,
        backgroundColor: 'primary.main',
        color: 'white',
        borderRadius: '50%',
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