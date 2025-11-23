import React, { useState, useEffect, useMemo } from 'react';
import {
    Grid, Paper, Typography, Box, Button, Card, CardContent, Avatar, Chip,
    LinearProgress, Divider, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import IssueBookModal from './IssueBookModal';
import ReturnBookModal from './ReturnBookModal';

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
    height: '100%',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '15px',
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: 'bold',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
    }
}));

const QuickStatCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '15px',
    backgroundColor: '#f8f9fa',
    border: '2px solid #e9ecef',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        borderColor: '#667eea',
        backgroundColor: '#fff',
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    }
}));

function DashboardPage() {
    const [books, setBooks] = useState([]);
    const [students, setStudents] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [booksRes, studentsRes, transactionsRes, reservationsRes] = await Promise.all([
                fetch('http://localhost:8080/api/books'),
                fetch('http://localhost:8080/api/students'),
                fetch('http://localhost:8080/api/transactions'),
                fetch('http://localhost:8080/api/reservations'),
            ]);

            const booksData = await booksRes.json();
            const studentsData = await studentsRes.json();
            const transactionsData = await transactionsRes.json();
            const reservationsData = await reservationsRes.json();

            setBooks(Array.isArray(booksData) ? booksData : []);
            setStudents(Array.isArray(studentsData) ? studentsData : []);
            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
            setReservations(Array.isArray(reservationsData) ? reservationsData : []);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const summaryData = useMemo(() => {
        const issuedBooks = transactions.filter(t => t.returnDate === null).length;
        const today = new Date();
        const overdueBooks = transactions.filter(t =>
            t.returnDate === null && new Date(t.dueDate) < today
        ).length;
        const totalCopies = books.reduce((sum, book) => sum + book.copies, 0);
        const availableBooks = books.filter(b => b.copies > 0).length;
        const returnedBooks = transactions.filter(t => t.returnDate !== null).length;
        const returnRate = transactions.length > 0 ? ((returnedBooks / transactions.length) * 100).toFixed(1) : 0;

        return {
            totalBooks: totalCopies,
            totalMembers: students.length,
            issuedBooks,
            overdueBooks,
            reservedBooks: reservations.length,
            availableBooks,
            totalTitles: books.length,
            returnedBooks,
            returnRate
        };
    }, [books, students, transactions, reservations]);

    // Top borrowed books
    const topBooks = useMemo(() => {
        const bookCounts = {};
        transactions.forEach(t => {
            bookCounts[t.bookId] = (bookCounts[t.bookId] || 0) + 1;
        });
        return Object.keys(bookCounts)
            .map(bookId => ({
                title: books.find(b => b.id === bookId)?.title || 'Unknown',
                count: bookCounts[bookId]
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [transactions, books]);

    // Genre distribution
    const genreData = useMemo(() => {
        const genres = {};
        books.forEach(book => {
            genres[book.genre] = (genres[book.genre] || 0) + book.copies;
        });
        return Object.keys(genres).map(key => ({
            name: key,
            value: genres[key]
        }));
    }, [books]);

    // Activity timeline
    const recentActivity = useMemo(() => {
        return transactions
            .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
            .slice(0, 6);
    }, [transactions]);

    // Weekly stats (mock data - can be calculated from actual data)
    const weeklyStats = [
        { day: 'Mon', issued: 12, returned: 10 },
        { day: 'Tue', issued: 15, returned: 13 },
        { day: 'Wed', issued: 18, returned: 16 },
        { day: 'Thu', issued: 14, returned: 15 },
        { day: 'Fri', issued: 20, returned: 18 },
        { day: 'Sat', issued: 8, returned: 10 },
        { day: 'Sun', issued: 5, returned: 7 },
    ];

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

    const handleIssueConfirm = async (issuedBook, student) => {
        const newTransactionData = { bookId: issuedBook.id, studentId: student.id };
        try {
            await fetch('http://localhost:8080/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTransactionData),
            });
            fetchData();
        } catch (error) {
            console.error("Error issuing book:", error);
        }
    };

    const handleReturnConfirm = async (returnedTransaction, fineAmount, reservationIdToFulfill) => {
        try {
            const updatedTransaction = { ...returnedTransaction, finePaid: fineAmount, reservationIdToFulfill };
            await fetch(`http://localhost:8080/api/transactions/${returnedTransaction.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTransaction),
            });
            fetchData();
        } catch (error) {
            console.error("Error returning book:", error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
                <Typography align="center" sx={{ mt: 2 }}>Loading dashboard...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        Dashboard Overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back! Here's what's happening in your library today
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

            {/* Main Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StyledCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#ffffff' }}>
                                        {summaryData.totalBooks}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                        Total Book Copies
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Chip
                                            label={`${summaryData.totalTitles} titles`}
                                            size="small"
                                            sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold' }}
                                        />
                                        <Chip
                                            label={`${summaryData.availableBooks} available`}
                                            size="small"
                                            sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold' }}
                                        />
                                    </Box>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 70, height: 70 }}>
                                    <MenuBookIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <StyledCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#ffffff' }}>
                                        {summaryData.totalMembers}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                        Library Members
                                    </Typography>
                                    <Chip
                                        label="Active members"
                                        size="small"
                                        sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold' }}
                                    />
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 70, height: 70 }}>
                                    <GroupIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <StyledCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#ffffff' }}>
                                        {summaryData.issuedBooks}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                        Currently Issued
                                    </Typography>
                                    <Chip
                                        label={`${summaryData.reservedBooks} reserved`}
                                        size="small"
                                        sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold' }}
                                    />
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 70, height: 70 }}>
                                    <AutoStoriesIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <StyledCard gradient={
                        summaryData.overdueBooks > 0
                            ? "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                            : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    }>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, }}>
                                        {summaryData.overdueBooks}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                        Overdue Books
                                    </Typography>
                                    <Chip
                                        label={summaryData.overdueBooks > 0 ? "Needs attention" : "All clear"}
                                        size="small"
                                        icon={summaryData.overdueBooks > 0 ? <WarningAmberIcon /> : <CheckCircleIcon />}
                                        sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold' }}
                                    />
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 70, height: 70 }}>
                                    {summaryData.overdueBooks > 0 ? (
                                        <WarningAmberIcon sx={{ fontSize: 40 }} />
                                    ) : (
                                        <CheckCircleIcon sx={{ fontSize: 40 }} />
                                    )}
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* Quick Actions & Stats Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <ActionButton
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setIssueModalOpen(true)}
                                    startIcon={<BookmarksIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        py: 2
                                    }}
                                >
                                    Issue Book
                                </ActionButton>
                            </Grid>
                            <Grid item xs={6}>
                                <ActionButton
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setReturnModalOpen(true)}
                                    startIcon={<AssignmentReturnIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        color: 'white',
                                        py: 2
                                    }}
                                >
                                    Return Book
                                </ActionButton>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                            Quick Statistics
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <QuickStatCard>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                                        {summaryData.returnRate}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Return Rate
                                    </Typography>
                                </QuickStatCard>
                            </Grid>
                            <Grid item xs={6}>
                                <QuickStatCard>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#43e97b' }}>
                                        {summaryData.returnedBooks}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Returns
                                    </Typography>
                                </QuickStatCard>
                            </Grid>
                        </Grid>
                    </StyledPaper>
                </Grid>

                {/* Top Borrowed Books */}
                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Top Borrowed Books
                        </Typography>
                        {topBooks.map((book, index) => (
                            <Box key={index}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    py: 2
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                        <Avatar sx={{
                                            backgroundColor: COLORS[index % COLORS.length],
                                            fontWeight: 'bold'
                                        }}>
                                            {index + 1}
                                        </Avatar>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: index === 0 ? 'bold' : 'normal',
                                                flex: 1
                                            }}
                                        >
                                            {book.title}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${book.count} times`}
                                        size="small"
                                        color={index === 0 ? 'primary' : 'default'}
                                    />
                                </Box>
                                {index < topBooks.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </StyledPaper>
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Weekly Activity */}
                <Grid item xs={12} md={8}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Weekly Activity
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weeklyStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="issued" fill="#667eea" radius={[10, 10, 0, 0]} />
                                <Bar dataKey="returned" fill="#43e97b" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </StyledPaper>
                </Grid>

                {/* Collection Distribution */}
                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Collection by Genre
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={genreData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {genreData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </StyledPaper>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <StyledPaper>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                    Recent Transactions
                </Typography>
                {recentActivity.length > 0 ? (
                    recentActivity.map((transaction, index) => (
                        <Box key={transaction.id}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                py: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                    <Avatar sx={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                        <AutoStoriesIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {transaction.bookTitle}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {transaction.studentName} • {new Date(transaction.issueDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label={transaction.returnDate ? 'Returned' : 'Active'}
                                    color={transaction.returnDate ? 'success' : 'primary'}
                                    size="small"
                                />
                            </Box>
                            {index < recentActivity.length - 1 && <Divider />}
                        </Box>
                    ))
                ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                        No recent transactions
                    </Typography>
                )}
            </StyledPaper>

            {/* Modals */}
            <IssueBookModal
                open={issueModalOpen}
                onClose={() => setIssueModalOpen(false)}
                books={books}
                students={students}
                onIssueConfirm={handleIssueConfirm}
            />
            <ReturnBookModal
                open={returnModalOpen}
                onClose={() => setReturnModalOpen(false)}
                transactions={transactions}
                onReturnConfirm={handleReturnConfirm}
                reservations={reservations}
                students={students}
            />
        </Box>
    );
}

export default DashboardPage;