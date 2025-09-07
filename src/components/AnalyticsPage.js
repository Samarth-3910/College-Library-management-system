// src/components/AnalyticsPage.js
import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';

// This component will need access to transactions and books
function AnalyticsPage({ transactions, books, students }) {

  // useMemo is perfect for expensive calculations like data aggregation.
  // This will only re-run if the transactions list changes.
  const popularBooksData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // 1. Count the occurrences of each bookId in the transactions
    const bookCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.bookId] = (acc[transaction.bookId] || 0) + 1;
      return acc;
    }, {});

    // 2. Map the counts to a format Recharts can use, including the book title
    const chartData = Object.keys(bookCounts)
      .map(bookId => {
        const book = books.find(b => b.id === bookId);
        return {
          title: book ? book.title : 'Unknown Book',
          borrows: bookCounts[bookId],
        };
      })
      .sort((a, b) => b.borrows - a.borrows) // Sort descending
      .slice(0, 10); // Take the top 10

    return chartData;
  }, [transactions, books]);

  const defaultersData = useMemo(() => {
    const today = new Date();
    // Find all transactions that are not returned AND are past their due date
    const overdueTransactions = transactions.filter(t => {
      const dueDate = new Date(t.dueDate);
      return t.returnDate === null && dueDate < today;
    });

    // Map the data to a format for the DataGrid
    return overdueTransactions.map(t => {
      const student = students.find(s => s.id === t.studentId);
      const book = books.find(b => b.id === t.bookId);
      const daysOverdue = Math.floor((today - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
      return {
        id: t.id, // Unique ID for the row
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
      <Typography variant="h4" gutterBottom>
        Library Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* ... Popular Books Grid item ... */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Most Popular Books
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={popularBooksData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
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
           {/* ... Overdue Books Grid item ... */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                    Students with Overdue Books (Defaulter List)
                    </Typography>
                    <DataGrid
                    rows={defaultersData}
                    columns={defaulterColumns}
                    pageSizeOptions={[5, 10]}
                    />
                </Paper>
            </Grid>
        {/* We will add the Defaulter List here */}
      </Grid>
    </Box>
  );
}

export default AnalyticsPage;