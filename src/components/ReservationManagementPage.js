// ReservationManagementPage.js - Active Book Reservations
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function ReservationManagementPage({ reservations, books, students }) {
  const reservationRows = reservations.map(res => {
    const book = books.find(b => b.id === res.bookId);
    const student = students.find(s => s.id === res.studentId);
    return {
      id: res.id,
      bookTitle: book ? book.title : 'Book not found',
      studentName: student ? student.name : 'Student not found',
      reservationDate: new Date(res.date).toLocaleString(),
      bookId: res.bookId,
    };
  });

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
          initialState={{
            sorting: {
              sortModel: [{ field: 'reservationDate', sort: 'asc' }],
            },
          }}
          groupingColDef={{ headerName: 'Book' }}
          rowGroupingModel={['bookTitle']}
        />
      </Paper>
    </Box>
  );
}

export default ReservationManagementPage;