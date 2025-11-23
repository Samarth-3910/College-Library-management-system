import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Avatar,
    Chip, IconButton, LinearProgress, Divider, Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
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

const ReservationCard = styled(Card)(({ theme }) => ({
    borderRadius: '15px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    }
}));

function ReservationManagementPage() {
    const [reservationRows, setReservationRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [students, setStudents] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reservationsRes, booksRes, studentsRes] = await Promise.all([
                fetch('http://localhost:8080/api/reservations'),
                fetch('http://localhost:8080/api/books'),
                fetch('http://localhost:8080/api/students'),
            ]);
            const reservations = await reservationsRes.json();
            const booksData = await booksRes.json();
            const studentsData = await studentsRes.json();

            const validReservations = Array.isArray(reservations) ? reservations : [];
            const validBooks = Array.isArray(booksData) ? booksData : [];
            const validStudents = Array.isArray(studentsData) ? studentsData : [];

            setBooks(validBooks);
            setStudents(validStudents);

            // Enrich reservation data
            const enrichedRows = validReservations.map(res => {
                const book = validBooks.find(b => b.id === res.bookId);
                const student = validStudents.find(s => s.id === res.studentId);
                return {
                    id: res.id,
                    bookTitle: book ? book.title : 'Book not found',
                    bookId: res.bookId,
                    studentName: student ? student.name : 'Student not found',
                    studentId: res.studentId,
                    reservationDate: new Date(res.reservationDate).toLocaleString(),
                    reservationDateObj: new Date(res.reservationDate),
                };
            });
            setReservationRows(enrichedRows);
        } catch (error) {
            console.error("Failed to fetch reservation data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Group reservations by book
    const groupedReservations = useMemo(() => {
        const groups = {};
        reservationRows.forEach(res => {
            if (!groups[res.bookId]) {
                groups[res.bookId] = {
                    bookTitle: res.bookTitle,
                    bookId: res.bookId,
                    reservations: []
                };
            }
            groups[res.bookId].reservations.push(res);
        });

        // Sort reservations within each group by date
        Object.keys(groups).forEach(bookId => {
            groups[bookId].reservations.sort((a, b) =>
                a.reservationDateObj - b.reservationDateObj
            );
        });

        return Object.values(groups);
    }, [reservationRows]);

    const handleDeleteReservation = async (reservationId) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) {
            return;
        }

        try {
            await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
                method: 'DELETE'
            });
            fetchData();
        } catch (error) {
            console.error("Error deleting reservation:", error);
        }
    };

    const columns = [
        {
            field: 'bookTitle',
            headerName: 'Book Title',
            flex: 1,
            minWidth: 250
        },
        {
            field: 'studentName',
            headerName: 'Reserved By',
            flex: 1,
            minWidth: 200
        },
        {
            field: 'reservationDate',
            headerName: 'Date Reserved',
            width: 180
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteReservation(params.row.id)}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )
        }
    ];

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
                <Typography align="center" sx={{ mt: 2 }}>Loading reservations...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        Active Reservations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage book reservations and waiting lists
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
                <Grid item xs={12} sm={6} md={4}>
                    <StyledCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {reservationRows.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Total Reservations
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <BookmarksIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StyledCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {groupedReservations.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Books Reserved
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <MenuBookIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StyledCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {new Set(reservationRows.map(r => r.studentId)).size}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Students Waiting
                                    </Typography>
                                </Box>
                                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.3)', width: 60, height: 60 }}>
                                    <PersonIcon sx={{ fontSize: 35 }} />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* Grouped View */}
            {groupedReservations.length > 0 ? (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {groupedReservations.map(group => (
                        <Grid item xs={12} md={6} key={group.bookId}>
                            <ReservationCard>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{
                                            backgroundColor: '#667eea',
                                            mr: 2,
                                            width: 50,
                                            height: 50
                                        }}>
                                            <MenuBookIcon />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {group.bookTitle}
                                            </Typography>
                                            <Chip
                                                label={`${group.reservations.length} in queue`}
                                                size="small"
                                                color="primary"
                                                icon={<NotificationsActiveIcon />}
                                            />
                                        </Box>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                        Waiting Queue:
                                    </Typography>

                                    {group.reservations.map((res, index) => (
                                        <Box key={res.id}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                py: 1.5,
                                                backgroundColor: index === 0 ? '#f3e5f5' : 'transparent',
                                                px: index === 0 ? 2 : 0,
                                                borderRadius: index === 0 ? '10px' : 0,
                                                mb: index === 0 ? 1 : 0
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Chip
                                                        label={`#${index + 1}`}
                                                        size="small"
                                                        color={index === 0 ? 'primary' : 'default'}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                                            {res.studentName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            <AccessTimeIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                                                            {res.reservationDate}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteReservation(res.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            {index < group.reservations.length - 1 && <Divider />}
                                        </Box>
                                    ))}
                                </CardContent>
                            </ReservationCard>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <StyledPaper sx={{ textAlign: 'center', py: 6 }}>
                    <BookmarksIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No active reservations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Reservations will appear here when students reserve unavailable books
                    </Typography>
                </StyledPaper>
            )}

            {/* Table View */}
            {reservationRows.length > 0 && (
                <StyledPaper>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                        All Reservations (Table View)
                    </Typography>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={reservationRows}
                            columns={columns}
                            pageSize={10}
                            pageSizeOptions={[10, 25]}
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
            )}
        </Box>
    );
}

export default ReservationManagementPage;