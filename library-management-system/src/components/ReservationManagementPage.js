// ReservationManagementPage.js - Fetches its own data for display
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function ReservationManagementPage() {
  const [reservationRows, setReservationRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservationsRes, booksRes, studentsRes] = await Promise.all([
          fetch('http://localhost:8080/api/reservations'),
          fetch('http://localhost:8080/api/books'),
          fetch('http://localhost:8080/api/students'),
        ]);
        const reservations = await reservationsRes.json();
        const books = await booksRes.json();
        const students = await studentsRes.json();

        const validReservations = Array.isArray(reservations) ? reservations : [];
        const validBooks = Array.isArray(books) ? books : [];
        const validStudents = Array.isArray(students) ? students : [];

        // Enrich reservation data with book titles and student names
        const enrichedRows = validReservations.map(res => {
          const book = validBooks.find(b => b.id === res.bookId);
          const student = validStudents.find(s => s.id === res.studentId);
          return {
            id: res.id,
            bookTitle: book ? book.title : 'Book not found',
            studentName: student ? student.name : 'Student not found',
            reservationDate: new Date(res.reservationDate).toLocaleString(), // Assuming 'reservationDate' from backend
            bookId: res.bookId,
          };
        });
        setReservationRows(enrichedRows);
      } catch (error) {
        console.error("Failed to fetch reservation data:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { field: 'bookTitle', headerName: 'Book Title', width: 300 },
    { field: 'studentName', headerName: 'Reserved By', width: 250 },
    { field: 'reservationDate', headerName: 'Date Reserved', width: 250 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Active Reservations</Typography>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={reservationRows}
          columns={columns}
          pageSizeOptions={[10, 25]}
          initialState={{ sorting: { sortModel: [{ field: 'reservationDate', sort: 'asc' }] } }}
          groupingColDef={{ headerName: 'Book' }}
          rowGroupingModel={['bookTitle']}
        />
      </Paper>
    </Box>
  );
}

export default ReservationManagementPage;