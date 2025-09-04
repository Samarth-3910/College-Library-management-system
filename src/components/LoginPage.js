// src/components/LoginPage.js
import React, { useState } from 'react'; // <-- Import useState
import { Container, Card, Typography, TextField, Button, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // --- CONCEPT: State ---
  // 'state' is a component's memory. We use the 'useState' hook to create state variables.
  // 'email' will hold the value of the email input. `setEmail` is the function to update it.
  // It starts as an empty string: useState('').
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  // --- CONCEPT: Event Handlers ---
  // This function will be called when the user clicks the login button.
  const handleLogin = () => {
    // For now, we'll just log the values to the browser's console.
    // In a real app, this is where you would send the data to a server.
    console.log('Login successful, navigating to dashboard...');
    navigate('/dashboard');
  };

  return (
    // Box is a helper component for styling. We use it to center the card.
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh', // Full viewport height
      backgroundColor: '#f7f9fc'
    }}>
      <Container component="main" maxWidth="xs">
        <Card sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LockOutlinedIcon sx={{ fontSize: 40, mb: 2 }} />
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email} // The input's value is tied to our 'email' state variable.
            onChange={(e) => setEmail(e.target.value)} // When the user types, we call setEmail to update the state.
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password} // The input's value is tied to our 'password' state variable.
            onChange={(e) => setPassword(e.target.value)} // When the user types, we update the password state.
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }} // mt = margin-top, mb = margin-bottom
            onClick={handleLogin} // We link our function to the button's click event.
          >
            Sign In
          </Button>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;