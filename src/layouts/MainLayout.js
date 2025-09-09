// MainLayout.js - Librarian Dashboard Layout with Sidebar
import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Header from '../components/Header';
import AuthContext from '../context/AuthContext';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

const drawerWidth = 240;

function MainLayout() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Books', icon: <BookIcon />, path: '/books' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Reservations', icon: <LibraryAddCheckIcon />, path: '/reservations' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'QR Codes', icon: <QrCodeIcon />, path: '/qr-utility' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />

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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
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