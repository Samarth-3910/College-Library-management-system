import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';

function AnalyticsPage({ transactions, books, students }) {
  const popularBooksData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const bookCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.bookId] = (acc[transaction.bookId] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(bookCounts)
      .map(bookId => {
        const book = books.find(b => b.id === bookId);
        return {
          title: book ? book.title : 'Unknown Book',
          borrows: bookCounts[bookId],
        };
      })
      .sort((a, b) => b.borrows - a.borrows)
      .slice(0, 10);

    return chartData;
  }, [transactions, books]);

  const defaultersData = useMemo(() => {
    const today = new Date();
    const overdueTransactions = transactions.filter(t => {
      const dueDate = new Date(t.dueDate);
      return t.returnDate === null && dueDate < today;
    });

    return overdueTransactions.map(t => {
      const student = students.find(s => s.id === t.studentId);
      const book = books.find(b => b.id === t.bookId);
      const daysOverdue = Math.floor((today - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
      return {
        id: t.id,
        studentName: student ? student.name : 'Unknown',
        bookTitle: book ? book.title : 'Unknown',
        dueDate: new Date(t.dueDate).toLocaleDateString(),
        daysOverdue: daysOverdue,
      };
    });
  }, [transactions, books, students]);

  const defaulterColumns = [
    { field: 'studentName', headerName: 'Student Name', width: 200 },
    { field: 'bookTitle', headerName: 'Book Title', width: 300 },
    { field: 'dueDate', headerName: 'Due Date', width: 150 },
    { field: 'daysOverdue', headerName: 'Days Overdue', type: 'number', width: 150 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Library Analytics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>Most Popular Books</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={popularBooksData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="borrows" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>Students with Overdue Books (Defaulter List)</Typography>
            <DataGrid rows={defaultersData} columns={defaulterColumns} pageSizeOptions={[5, 10]} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsPage;