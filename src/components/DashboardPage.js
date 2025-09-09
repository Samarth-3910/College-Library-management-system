// DashboardPage.js - Main Dashboard with Quick Actions
import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import SummaryCard from './SummaryCard';
import IssueBookModal from './IssueBookModal';
import ReturnBookModal from './ReturnBookModal';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import GppGoodIcon from '@mui/icons-material/GppGood';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const summaryData = {
  totalBooks: 1250,
  totalMembers: 342,
  issuedBooks: 78,
  overdueBooks: 12,
};

function DashboardPage({ books, students, setBooks, transactions, setTransactions, reservations, setReservations }) {
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  
  const handleIssueConfirm = (issuedBook, student) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === issuedBook.id
          ? { ...book, copies: book.copies - 1 }
          : book
      )
    );

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 15);
    
    const newTransaction = {
      id: `T${Date.now()}`,
      bookId: issuedBook.id,
      bookTitle: issuedBook.title,
      studentId: student.id,
      studentName: student.name,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
    };

    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  const handleReturnConfirm = (returnedTransaction, fineAmount, reservationIdToFulfill) => {
    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === returnedTransaction.bookId) {
          const newCopies = reservationIdToFulfill ? book.copies : book.copies + 1;
          return { ...book, copies: newCopies };
        }
        return book;
      })
    );

    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === returnedTransaction.id
          ? { ...t, returnDate: new Date().toISOString(), finePaid: fineAmount }
          : t
      )
    );

    if (reservationIdToFulfill) {
      setReservations(prevReservations =>
        prevReservations.filter(res => res.id !== reservationIdToFulfill)
      );
      console.log(`Reservation ${reservationIdToFulfill} has been fulfilled!`);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Total Books" value={summaryData.totalBooks} icon={<MenuBookIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Total Members" value={summaryData.totalMembers} icon={<GroupIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Books Issued" value={summaryData.issuedBooks} icon={<GppGoodIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Books Overdue" value={summaryData.overdueBooks} icon={<WarningAmberIcon fontSize="large" />} />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Button variant="contained" onClick={() => setIssueModalOpen(true)}>
          Issue a Book
        </Button>
        <Button variant="outlined" onClick={() => setReturnModalOpen(true)}>
          Return a Book
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6">Recent Activity</Typography>
        <Typography color="text.secondary">
          A table of recently issued and returned books will go here.
        </Typography>
      </Paper>

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