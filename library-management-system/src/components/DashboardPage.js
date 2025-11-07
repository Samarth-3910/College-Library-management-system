// DashboardPage.js - Fetches all data to act as the main hub
import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import SummaryCard from './SummaryCard';
import IssueBookModal from './IssueBookModal';
import ReturnBookModal from './ReturnBookModal';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import GppGoodIcon from '@mui/icons-material/GppGood';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function DashboardPage() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const fetchData = async () => {
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
      setBooks([]);
      setStudents([]);
      setTransactions([]);
      setReservations([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summaryData = useMemo(() => {
    const issuedBooks = transactions.filter(t => t.returnDate === null).length;
    const today = new Date();
    const overdueBooks = transactions.filter(t => t.returnDate === null && new Date(t.dueDate) < today).length;

    return {
      totalBooks: books.reduce((sum, book) => sum + book.copies, 0),
      totalMembers: students.length,
      issuedBooks,
      overdueBooks,
    };
  }, [books, students, transactions]);

  const handleIssueConfirm = async (issuedBook, student) => {
    const newTransactionData = { bookId: issuedBook.id, studentId: student.id };

    try {
      // The backend should handle setting dates, updating copies, and creating the transaction
      await fetch('http://localhost:8080/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransactionData),
      });
      // After a successful transaction, refetch all data to ensure UI is consistent
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
      // Refetch all data to get the latest state of books, transactions, and reservations
      fetchData();
    } catch(error) {
      console.error("Error returning book:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total Books" value={summaryData.totalBooks} icon={<MenuBookIcon fontSize="large" />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total Members" value={summaryData.totalMembers} icon={<GroupIcon fontSize="large" />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Books Issued" value={summaryData.issuedBooks} icon={<GppGoodIcon fontSize="large" />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Books Overdue" value={summaryData.overdueBooks} icon={<WarningAmberIcon fontSize="large" />} /></Grid>
      </Grid>
      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Button variant="contained" onClick={() => setIssueModalOpen(true)} sx={{mr: 2}}>Issue a Book</Button>
        <Button variant="outlined" onClick={() => setReturnModalOpen(true)}>Return a Book</Button>
      </Paper>
      <Paper sx={{ p: 2, mt: 4 }}><Typography variant="h6">Recent Activity</Typography><Typography color="text.secondary">A table of recently issued and returned books will go here.</Typography></Paper>
      <IssueBookModal open={issueModalOpen} onClose={() => setIssueModalOpen(false)} books={books} students={students} onIssueConfirm={handleIssueConfirm} />
      <ReturnBookModal open={returnModalOpen} onClose={() => setReturnModalOpen(false)} transactions={transactions} onReturnConfirm={handleReturnConfirm} reservations={reservations} students={students} />
    </Box>
  );
}

export default DashboardPage;