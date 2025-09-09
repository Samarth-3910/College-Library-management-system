// StudentLayout.js - Student Dashboard Layout with Tabs
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, Paper, Toolbar } from '@mui/material';
import Header from '../components/Header';

function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Box>
      <Header />
      <Toolbar />
      <Paper square sx={{
        position: 'sticky',
        top: 64,
        zIndex: 1000,
        backgroundColor: 'white'
      }}>
        <Tabs
          value={currentPath}
          onChange={(event, newValue) => navigate(newValue)}
          centered
        >
          <Tab label="My Dashboard" value="/student-dashboard" />
          <Tab label="Browse Books" value="/catalog" />
        </Tabs>
      </Paper>
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default StudentLayout;