// src/components/ReservationManagementPage.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// We'll pass `reservations`, `books`, and `students` as props to get all the info we need
function ReservationManagementPage({ reservations, books, students }) {

  // We need to enrich the reservation data with book titles and student names for a user-friendly display
  const reservationRows = reservations.map(res => {
    const book = books.find(b => b.id === res.bookId);
    const student = students.find(s => s.id === res.studentId);
    return {
      id: res.id,
      bookTitle: book ? book.title : 'Book not found',
      studentName: student ? student.name : 'Student not found',
      reservationDate: new Date(res.date).toLocaleString(),
      bookId: res.bookId, // Keep this for grouping/logic
    };
  });

  const columns = [
    { field: 'bookTitle', headerName: 'Book Title', width: 300 },
    { field: 'studentName', headerName: 'Reserved By', width: 250 },
    { field: 'reservationDate', headerName: 'Date Reserved', width: 250 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Active Reservations
      </Typography>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={reservationRows}
          columns={columns}
          pageSizeOptions={[10, 25]}
          // Grouping by book title to see the queue for each book
          initialState={{
            sorting: {
              sortModel: [{ field: 'reservationDate', sort: 'asc' }],
            },
          }}
          groupingColDef={{
            headerName: 'Book',
          }}
          rowGroupingModel={['bookTitle']}
        />
      </Paper>
    </Box>
  );
}

export default ReservationManagementPage;