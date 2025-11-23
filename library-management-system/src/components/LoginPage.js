import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { setCurrentUser } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const user = await response.json();
            setCurrentUser(user);

            if (user.role === 'librarian') {
                navigate('/dashboard');
            } else if (user.role === 'student') {
                navigate('/student-dashboard');
            }

        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <StyledWrapper>
                <div className="container">
                    <div className="heading">Sign In</div>
                    <div className="subtitle">Library Management System</div>

                    {error && <div className="error-message">{error}</div>}

                    <form className="form" onSubmit={handleLogin}>
                        <input
                            required
                            className="input"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            required
                            className="input"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />

                        <button
                            className="login-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} color="inherit" style={{ marginRight: '10px' }} />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="demo-credentials" style={{ marginTop: '15px' }}>
                        <div className="demo-title">Demo Credentials (Testing):</div>
                        <div className="demo-item">
                            <strong>Librarian:</strong> librarian@library.com / admin123
                        </div>
                        <div className="demo-item">
                            <strong>Student:</strong> alice.j@university.edu / any password
                        </div>
                    </div>

                    <div className="register-link">
                        Credentials provided by college administration
                    </div>
                </div>
            </StyledWrapper>
        </PageWrapper>
    );
};

const PageWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #212121 0%, #212121 100%);
    padding: 20px;
`;

const StyledWrapper = styled.div`
    .container {
        max-width: 400px;
        width: 100%;
        background: #F8F9FD;
        background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
        border-radius: 40px;
        padding: 35px 40px;
        border: 5px solid rgb(255, 255, 255);

    }

    .heading {
        text-align: center;
        font-weight: 900;
        font-size: 32px;
        color: rgb(16, 137, 211);
        margin-bottom: 5px;
    }

    .subtitle {
        text-align: center;
        font-size: 14px;
        color: rgb(100, 100, 100);
        margin-bottom: 25px;
    }

    .error-message {
        background: #fee;
        color: #c33;
        padding: 12px;
        border-radius: 15px;
        text-align: center;
        margin-bottom: 15px;
        font-size: 13px;
        border: 2px solid #fcc;
    }

    .form {
        margin-top: 20px;
    }

    .form .input {
        width: 100%;
        background: white;
        border: none;
        padding: 15px 20px;
        border-radius: 20px;
        margin-top: 15px;
        box-shadow: #cff0ff 0px 10px 10px -5px;
        border-inline: 2px solid transparent;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .form .input::placeholder {
        color: rgb(170, 170, 170);
    }

    .form .input:focus {
        outline: none;
        border-inline: 2px solid #12B1D1;
        transform: translateY(-2px);
        box-shadow: #cff0ff 0px 15px 15px -5px;
    }

    .form .input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .form .login-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-weight: bold;
        background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
        color: white;
        padding: 15px;
        margin: 25px auto 20px;
        border-radius: 20px;
        box-shadow: rgba(133, 189, 215, 0.878) 0px 20px 10px -15px;
        border: none;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        font-size: 16px;
    }

    .form .login-button:hover:not(:disabled) {
        transform: scale(1.03);
        box-shadow: rgba(133, 189, 215, 0.878) 0px 23px 10px -20px;
    }

    .form .login-button:active:not(:disabled) {
        transform: scale(0.95);
        box-shadow: rgba(133, 189, 215, 0.878) 0px 15px 10px -10px;
    }

    .form .login-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .demo-credentials {
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        border-radius: 15px;
        padding: 15px;
        margin-top: 20px;
        border: 2px solid #bbdefb;
    }

    .demo-title {
        font-weight: bold;
        color: rgb(16, 137, 211);
        margin-bottom: 8px;
        font-size: 13px;
    }

    .demo-item {
        font-size: 12px;
        color: rgb(80, 80, 80);
        margin: 5px 0;
        padding: 5px 10px;
        background: white;
        border-radius: 8px;
    }

    .demo-item strong {
        color: rgb(16, 137, 211);
    }

    .register-link {
        text-align: center;
        margin-top: 20px;
        font-size: 13px;
        color: rgb(100, 100, 100);
    }

    .register-link a {
        color: #0099ff;
        text-decoration: none;
        font-weight: bold;
        transition: all 0.2s ease;
    }

    .register-link a:hover {
        color: rgb(16, 137, 211);
        text-decoration: underline;
    }
`;

export default LoginPage;