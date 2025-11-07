// AnalyticsPage.js - Fetches its own data for visualization
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';

function AnalyticsPage() {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
      }
    };
    fetchData();
  }, []);

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

  const defaultersData = useMemo(() => {
    const today = new Date();
    return transactions
      .filter(t => t.returnDate === null && new Date(t.dueDate) < today)
      .map(t => {
        const student = students.find(s => s.id === t.studentId);
        const book = books.find(b => b.id === t.bookId);
        const daysOverdue = Math.floor((today - new Date(t.dueDate)) / (1000 * 60 * 60 * 24));
        return {
          id: t.id,
          studentName: student?.name || 'Unknown',
          bookTitle: book?.title || 'Unknown',
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
              <BarChart data={popularBooksData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="title" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="borrows" fill="#8884d8" /></BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>Students with Overdue Books</Typography>
            <DataGrid rows={defaultersData} columns={defaulterColumns} pageSizeOptions={[5, 10]} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsPage;