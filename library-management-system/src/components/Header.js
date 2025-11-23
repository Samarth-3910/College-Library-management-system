// Header.js - Enhanced Professional Header Component
import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BookIcon from '@mui/icons-material/Book';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.25)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
}));

const BrandSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const LogoIcon = styled(BookIcon)(({ theme }) => ({
  fontSize: 32,
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
}));

const BrandText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 700,
  fontSize: '1.25rem',
  letterSpacing: '0.5px',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.95rem',
  marginRight: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  cursor: 'pointer',
  border: '2px solid rgba(255,255,255,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    border: '2px solid rgba(255,255,255,0.6)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: 'scale(1.1)',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    marginTop: theme.spacing(1),
    minWidth: 200,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: 8,
  margin: theme.spacing(0.5, 1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    transform: 'translateX(4px)',
  },
}));

function Header() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleMenuClose();
    navigate('/login');
  };

  const handleBrandClick = () => {
    if (currentUser?.role === 'librarian') {
      navigate('/dashboard');
    } else if (currentUser?.role === 'student') {
      navigate('/student-dashboard');
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser?.name) return 'U';
    const names = currentUser.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.name.substring(0, 2).toUpperCase();
  };

  // Get user role display
  const getRoleDisplay = () => {
    if (currentUser?.role === 'librarian') return 'Librarian';
    if (currentUser?.role === 'student') return 'Student';
    return 'User';
  };

  return (
    <StyledAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ py: 0.5 }}>
        {/* Brand Section */}
        <BrandSection onClick={handleBrandClick}>
          <LogoIcon />
          <Box>
            <BrandText variant="h6" component="div">
              Library Portal
            </BrandText>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.7rem',
                opacity: 0.9,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              College Management System
            </Typography>
          </Box>
        </BrandSection>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* User Section */}
        <UserSection>
          {/* Welcome Text */}
          <WelcomeText>
            Welcome, <strong>{currentUser?.name || 'Guest'}</strong>
          </WelcomeText>

          {/* Notifications */}
          <StyledIconButton size="small">
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </StyledIconButton>

          {/* User Avatar & Menu */}
          <StyledAvatar
            onClick={handleMenuOpen}
            sx={{
              bgcolor: currentUser?.role === 'librarian' ? '#7b1fa2' : '#00897b'
            }}
          >
            {getUserInitials()}
          </StyledAvatar>

          <StyledMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {/* User Info */}
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {currentUser?.name || 'Guest'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.email || 'No email'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.7rem'
                }}
              >
                {getRoleDisplay()}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Menu Items */}
            <StyledMenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </StyledMenuItem>

            <StyledMenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </StyledMenuItem>

            <Divider sx={{ my: 1 }} />

            <StyledMenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
            </StyledMenuItem>
          </StyledMenu>
        </UserSection>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;