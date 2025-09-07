// src/components/Header.js

import React, { useContext} from 'react';
// Let's import the components we need from MUI
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import BookIcon from '@mui/icons-material/Book'; // An icon from the icons package
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Header() {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
      setCurrentUser(null);
      navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <BookIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Welcome, {currentUser?.name || 'Guest'}
            </Typography>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>

          </Toolbar>
        </AppBar>
      );
    }

export default Header;