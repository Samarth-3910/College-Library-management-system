// src/layouts/StudentLayout.js
import React from 'react';
// 1. Import useLocation along with useNavigate
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, Paper, Toolbar } from '@mui/material';
import Header from '../components/Header';

function StudentLayout() {
  const navigate = useNavigate();
  // 2. Use the hook to get the location object
  const location = useLocation();

  // 3. The current pathname is now a reactive variable
  const currentPath = location.pathname;

  return (
    <Box>
      <Header />
      {/* Add a Toolbar spacer to push content below the fixed Header */}
      <Toolbar />
      <Paper square sx={{
        // A sticky position keeps the tabs at the top when scrolling
        position: 'sticky',
        top: 64, // Height of the AppBar
        zIndex: 1000,
        backgroundColor: 'white'
      }}>
        <Tabs
          // 4. Use the reactive variable here
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