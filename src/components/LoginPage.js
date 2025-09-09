// LoginPage.js - User Authentication
import React, { useState, useContext } from 'react';
import { Container, Card, Typography, TextField, Button, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function LoginPage({ students }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleLogin = () => {
    if (email.toLowerCase() === 'librarian@library.com') {
      setCurrentUser({
        id: 'L001',
        name: 'Librarian',
        role: 'librarian',
      });
      navigate('/dashboard');
      return;
    }

    const foundStudent = students.find(
      (student) => student.email.toLowerCase() === email.toLowerCase()
    );

    if (foundStudent) {
      setCurrentUser({
        ...foundStudent,
        role: 'student',
      });
      navigate('/student-dashboard');
      return;
    }

    alert('Invalid credentials. Please try again.');
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f7f9fc'
    }}>
      <Container component="main" maxWidth="xs">
        <Card sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LockOutlinedIcon sx={{ fontSize: 40, mb: 2 }} />
          <Typography component="h1" variant="h5">Sign In</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;