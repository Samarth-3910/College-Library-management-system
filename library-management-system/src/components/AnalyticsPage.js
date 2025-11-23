import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Avatar, Chip,
    IconButton, LinearProgress, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/Star';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
    height: '100%',
}));

const StyledCard = styled(Card)(({ theme, gradient }) => ({
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
    }
}));

function AnalyticsPage() {
    const [transactions, setTransactions] = useState([]);
    const [books, setBooks] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [transactionsRes, booksRes, studentsRes] = await Promise.all([
                fetch('http://localhost:8080/api/transactions'),
                fetch('http://localhost:8080/api/books'),
                fetch('http://localhost:8080/api/students'),
            ]);
            const transactionsData = await transactionsRes.json();
            const booksData = await booksRes.json();
            const studentsData = await studentsRes.json();

            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
            setBooks(Array.isArray(booksData) ? booksData : []);
            setStudents(Array.isArray(studentsData) ? studentsData : []);
        } catch (error) {
            console.error("Failed to fetch analytics data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Popular Books Data
    const popularBooksData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];
        const bookCounts = transactions.reduce((acc, transaction) => {
            acc[transaction.bookId] = (acc[transaction.bookId] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(bookCounts)
            .map(bookId => ({
                title: books.find(b => b.id === bookId)?.title || 'Unknown Book',
                borrows: bookCounts[bookId],
            }))
            .sort((a, b) => b.borrows - a.borrows)
            .slice(0, 10);
    }, [transactions, books]);

    // Genre Distribution
    const genreData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];
        const genreCounts = {};
        transactions.forEach(t => {
            const book = books.find(b => b.id === t.bookId);
            if (book && book.genre) {
                genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
            }
        });
        return Object.keys(genreCounts).map(key => ({
            name: key,
            value: genreCounts[key]
        }));
    }, [transactions, books]);

    // Defaulters Data
    const defaultersData = useMemo(() => {
        const today = new Date();
        return transactions
            .filter(t => t.returnDate === null && new Date(t.dueDate) < today)
            .map(t => {
                const student = students.find(s => s.id === t.studentId);
                const book = books.find(b => b.id === t.bookId);
                const daysOverdue = Math.floor((today - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
                const fine = daysOverdue * 0.5;
                return {
                    id: t.id,
                    studentName: student?.name || 'Unknown',
                    studentId: t.studentId,
                    bookTitle: book?.title || 'Unknown',
                    dueDate: new Date(t.dueDate).toLocaleDateString(),
                    daysOverdue: daysOverdue,
                    fine: fine,
                };
            })
            .sort((a, b) => b.daysOverdue - a.daysOverdue);
    }, [transactions, books, students]);

    // Active Readers (most borrowed books)
    const activeReaders = useMemo(() => {
        const studentCounts = {};
        transactions.forEach(t => {
            studentCounts[t.studentId] = (studentCounts[t.studentId] || 0) + 1;
        });
        return Object.keys(studentCounts)
            .map(studentId => {
                const student = students.find(s => s.id === studentId);
                return {
                    name: student?.name || 'Unknown',
                    books: studentCounts[studentId]
                };
            })
            .sort((a, b) => b.books - a.books)
            .slice(0, 5);
    }, [transactions, students]);

    // Monthly activity (mock data - you can calculate from actual dates)
    const monthlyActivity = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map(month => ({
            month,
            issued: Math.floor(Math.random() * 50) + 30,
            returned: Math.floor(Math.random() * 50) + 25
        }));
    }, []);

    // Summary Stats
    const summaryStats = useMemo(() => {
        const totalIssued = transactions.length;
        const returned = transactions.filter(t => t.returnDate !== null).length;
        const active = totalIssued - returned;
        const overdue = defaultersData.length;
        const returnRate = totalIssued > 0 ? ((returned / totalIssued) * 100).toFixed(1) : 0;

        return { totalIssued, returned, active, overdue, returnRate };
    }, [transactions, defaultersData]);

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

    const defaulterColumns = [
        { field: 'studentName', headerName: 'Student Name', flex: 1, minWidth: 150 },
        { field: 'bookTitle', headerName: 'Book Title', flex: 1, minWidth: 200 },
        { field: 'dueDate', headerName: 'Due Date', width: 120 },
        {
            field: 'daysOverdue',
            headerName: 'Days Overdue',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={`${params.value} days`}
                    color="error"
                    size="small"
                />
            )
        },
        {
            field: 'fine',
            headerName: 'Fine',
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                    ${params.value.toFixed(2)}
                </Typography>
            )
        },
    ];

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
                <Typography align="center" sx={{ mt: 2 }}>Loading analytics...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        Library Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Insights and statistics for your library
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

            {/* Summary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {summaryStats.totalIssued}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Total Issued
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <MenuBookIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {summaryStats.returnRate}%
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Return Rate
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <TrendingUpIcon sx={{ fontSize: 35 }} />
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
                                        {summaryStats.active}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Currently Active
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <PersonIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StyledCard gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {summaryStats.overdue}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Overdue
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <WarningAmberIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Popular Books */}
                <Grid item xs={12} md={8}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Most Popular Books
                        </Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={popularBooksData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis
                                    dataKey="title"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    interval={0}
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="borrows" fill="#667eea" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </StyledPaper>
                </Grid>

                {/* Genre Distribution */}
                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Genre Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={genreData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
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

            {/* Charts Row 2 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Monthly Activity */}
                <Grid item xs={12} md={8}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Monthly Activity Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyActivity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="issued" stroke="#667eea" strokeWidth={3} />
                                <Line type="monotone" dataKey="returned" stroke="#43e97b" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </StyledPaper>
                </Grid>

                {/* Top Readers */}
                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                            Top Readers
                        </Typography>
                        {activeReaders.map((reader, index) => (
                            <Box key={index}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    py: 2
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{
                                            backgroundColor: COLORS[index % COLORS.length],
                                            width: 40,
                                            height: 40
                                        }}>
                                            {index === 0 && <StarIcon />}
                                            {index !== 0 && `${index + 1}`}
                                        </Avatar>
                                        <Typography variant="body1" sx={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                            {reader.name}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`${reader.books} books`}
                                        size="small"
                                        color={index === 0 ? 'primary' : 'default'}
                                    />
                                </Box>
                                {index < activeReaders.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </StyledPaper>
                </Grid>
            </Grid>

            {/* Defaulters Table */}
            <StyledPaper>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                    Students with Overdue Books
                </Typography>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={defaultersData}
                        columns={defaulterColumns}
                        pageSize={5}
                        pageSizeOptions={[5, 10]}
                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none'
                            }
                        }}
                    />
                </div>
            </StyledPaper>
        </Box>
    );
}

export default AnalyticsPage;