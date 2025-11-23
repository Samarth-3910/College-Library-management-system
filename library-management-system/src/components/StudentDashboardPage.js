import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, LinearProgress,
    Chip, Avatar, Divider, Paper, IconButton, Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AuthContext from '../context/AuthContext';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StyledCard = styled(Card)(({ theme, gradient }) => ({
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
    }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    }
}));

const BookCard = styled(Card)(({ theme, isOverdue }) => ({
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: isOverdue ? '2px solid #f44336' : '2px solid transparent',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    }
}));

function StudentDashboardPage() {
    const { currentUser } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!currentUser?.id) return;

        setLoading(true);
        try {
            const [transactionsRes, booksRes] = await Promise.all([
                fetch('http://localhost:8080/api/transactions'),
                fetch('http://localhost:8080/api/books')
            ]);

            const allTransactions = await transactionsRes.json();
            const allBooks = await booksRes.json();

            const userTransactions = allTransactions.filter(t => t.studentId === currentUser.id);
            setTransactions(userTransactions);
            setBooks(allBooks);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUser]);

    const stats = useMemo(() => {
        const currentLoans = transactions.filter(t => t.returnDate === null);
        const completedLoans = transactions.filter(t => t.returnDate !== null);
        const today = new Date();
        const overdueBooks = currentLoans.filter(t => new Date(t.dueDate) < today);
        const totalFines = transactions.reduce((sum, t) => sum + (t.finePaid || 0), 0);

        // Genre preferences
        const genreCount = {};
        transactions.forEach(t => {
            const book = books.find(b => b.id === t.bookId);
            if (book && book.genre) {
                genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
            }
        });

        const genreData = Object.keys(genreCount).map(key => ({
            name: key,
            value: genreCount[key]
        }));

        return {
            currentLoans: currentLoans.length,
            completedLoans: completedLoans.length,
            totalBooks: transactions.length,
            overdueBooks: overdueBooks.length,
            totalFines,
            genreData,
            currentBooksData: currentLoans,
            historyData: completedLoans.slice(0, 10)
        };
    }, [transactions, books]);

    // Recommendations based on reading history
    const recommendations = useMemo(() => {
        if (stats.genreData.length === 0) return [];

        const favoriteGenre = stats.genreData.sort((a, b) => b.value - a.value)[0]?.name;
        if (!favoriteGenre) return [];

        const readBookIds = transactions.map(t => t.bookId);
        return books
            .filter(b => b.genre === favoriteGenre && !readBookIds.includes(b.id) && b.copies > 0)
            .slice(0, 4);
    }, [stats.genreData, books, transactions]);

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
                <Typography align="center" sx={{ mt: 2 }}>Loading your dashboard...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        Welcome back, {currentUser?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your personal reading dashboard
                    </Typography>
                </Box>
                <IconButton
                    onClick={fetchData}
                    sx={{
                        backgroundColor: 'white',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                >
                    <RefreshIcon />
                </IconButton>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {stats.currentLoans}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Currently Reading
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <AutoStoriesIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {stats.totalBooks}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Total Books Read
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <LocalLibraryIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard gradient={
                        stats.overdueBooks > 0
                            ? "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                            : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    }>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {stats.overdueBooks}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Overdue Books
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    {stats.overdueBooks > 0 ? (
                                        <WarningAmberIcon sx={{ fontSize: 35 }} />
                                    ) : (
                                        <CheckCircleIcon sx={{ fontSize: 35 }} />
                                    )}
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        ${stats.totalFines.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Total Fines Paid
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <TrendingUpIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* Currently Reading Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Currently Reading
                        </Typography>
                        {stats.currentBooksData.length > 0 ? (
                            <Grid container spacing={2}>
                                {stats.currentBooksData.map((transaction) => {
                                    const dueDate = new Date(transaction.dueDate);
                                    const today = new Date();
                                    const isOverdue = dueDate < today;
                                    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

                                    return (
                                        <Grid item xs={12} key={transaction.id}>
                                            <BookCard isOverdue={isOverdue}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                                {transaction.bookTitle}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                                                <Chip
                                                                    icon={<AccessTimeIcon />}
                                                                    label={`Issued: ${new Date(transaction.issueDate).toLocaleDateString()}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                                <Chip
                                                                    icon={isOverdue ? <WarningAmberIcon /> : <CheckCircleIcon />}
                                                                    label={
                                                                        isOverdue
                                                                            ? `Overdue by ${Math.abs(daysUntilDue)} days`
                                                                            : `Due in ${daysUntilDue} days`
                                                                    }
                                                                    size="small"
                                                                    color={isOverdue ? 'error' : 'success'}
                                                                />
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={isOverdue ? 100 : ((15 - daysUntilDue) / 15) * 100}
                                                                sx={{
                                                                    height: 8,
                                                                    borderRadius: 5,
                                                                    backgroundColor: '#e0e0e0',
                                                                    '& .MuiLinearProgress-bar': {
                                                                        backgroundColor: isOverdue ? '#f44336' : '#4caf50'
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </BookCard>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <AutoStoriesIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                                <Typography color="text.secondary">
                                    No books currently borrowed
                                </Typography>
                            </Box>
                        )}
                    </StyledPaper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Reading Preferences
                        </Typography>
                        {stats.genreData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={stats.genreData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {stats.genreData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography color="text.secondary">
                                    Start reading to see your preferences
                                </Typography>
                            </Box>
                        )}
                    </StyledPaper>
                </Grid>
            </Grid>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <StyledPaper sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                        Recommended For You
                    </Typography>
                    <Grid container spacing={2}>
                        {recommendations.map((book) => (
                            <Grid item xs={12} sm={6} md={3} key={book.id}>
                                <Card sx={{
                                    borderRadius: '15px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    }
                                }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1rem' }}>
                                            {book.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            by {book.author}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                            <Chip label={book.genre} size="small" color="primary" variant="outlined" />
                                            <Chip
                                                label={`${book.copies} available`}
                                                size="small"
                                                color="success"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </StyledPaper>
            )}

            {/* Reading History */}
            <StyledPaper>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                    Reading History
                </Typography>
                {stats.historyData.length > 0 ? (
                    stats.historyData.map((transaction, index) => (
                        <Box key={transaction.id}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                py: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                        <HistoryIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {transaction.bookTitle}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Returned on {new Date(transaction.returnDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    {transaction.finePaid > 0 && (
                                        <Chip
                                            label={`Fine: $${transaction.finePaid.toFixed(2)}`}
                                            size="small"
                                            color="error"
                                        />
                                    )}
                                </Box>
                            </Box>
                            {index < stats.historyData.length - 1 && <Divider />}
                        </Box>
                    ))
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <HistoryIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                        <Typography color="text.secondary">
                            No reading history yet
                        </Typography>
                    </Box>
                )}
            </StyledPaper>
        </Box>
    );
}

export default StudentDashboardPage;