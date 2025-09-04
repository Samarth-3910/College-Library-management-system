// src/layouts/MainLayout.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Header from '../components/Header'; // We will keep using our header

// Import icons for our navigation items
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240; // Define a constant for the sidebar width

function MainLayout() {
  const navigate = useNavigate(); // Get the navigate function

  // An array of our navigation items. Makes the code cleaner.
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Books', icon: <BookIcon />, path: '/books' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' }, // Added for the future
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header is already in place, no changes needed here */}
      <Header />

      {/* The Sidebar (Drawer) */}
      <Drawer
        variant="permanent" // This makes it always visible
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {/* Toolbar is a spacer to push content below the AppBar */}
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)` }}
      >
        {/* This Toolbar spacer is crucial. It pushes the main content down */}
        {/* to account for the height of the fixed Header. */}
        <Toolbar />
        <Outlet /> {/* This is where our page components will render */}
      </Box>
    </Box>
  );
}

export default MainLayout;