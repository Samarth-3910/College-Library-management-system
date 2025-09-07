// src/layouts/MainLayout.js
import React, { useContext} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Header from '../components/Header';
import AuthContext from '../context/AuthContext'; // We will keep using our header
import AnalyticsIcon from '@mui/icons-material/Analytics';
import QrCodeIcon from '@mui/icons-material/QrCode';

// Import icons for our navigation items
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

const drawerWidth = 240; // Define a constant for the sidebar width

function MainLayout() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate(); // Get the navigate function

  // An array of our navigation items. Makes the code cleaner.
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Books', icon: <BookIcon />, path: '/books' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Reservations', icon: <LibraryAddCheckIcon />, path: '/reservations' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'QR Codes', icon: <QrCodeIcon />, path: '/qr-utility' },
    // Added for the future
  ];

  return (
    <Box sx={{ display: 'flex' }}>
        {/* 5. The Header no longer needs props passed to it */}
        <Header />

        {/* This logic now uses currentUser from the context. It should work perfectly. */}
        {currentUser?.role === 'librarian' && (
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton onClick={() => navigate(item.path)}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        )}

        {/*
          The main content area needs a dynamic width.
          If the user is a librarian (sidebar is visible), the width is smaller.
          If the user is a student (no sidebar), it should take up the full width.
        */}
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                p: 3,
                // 6. Adjust the width based on the user's role
                width: currentUser?.role === 'librarian' ? `calc(100% - ${drawerWidth}px)` : '100%',
            }}
        >
            <Toolbar />
            <Outlet />
        </Box>
    </Box>
  );
}

export default MainLayout;