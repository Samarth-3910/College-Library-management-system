// StudentDashboardPage.js - Fetches transaction data for the logged-in student
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Grid } from '@mui/material';
import AuthContext from '../context/AuthContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (<div role="tabpanel" hidden={value !== index} {...other}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>);
}

function StudentDashboardPage() {
  const { currentUser } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Only fetch transactions if a user is logged in
    if (currentUser?.id) {
      // In a real app, this would be a dedicated endpoint like /api/students/{id}/transactions
      // For now, we fetch all and filter on the client.
      fetch('http://localhost:8080/api/transactions')
        .then(res => res.json())
        .then(allTransactions => {
          const userTransactions = allTransactions.filter(t => t.studentId === currentUser.id);
          setTransactions(userTransactions);
        })
        .catch(error => console.error("Error fetching transactions:", error));
    }
  }, [currentUser]); // Re-fetch if the user changes

  const handleChange = (event, newValue) => setTabValue(newValue);

  const { currentLoans, loanHistory } = useMemo(() => {
    const currentLoans = transactions.filter(t => t.returnDate === null);
    const loanHistory = transactions.filter(t => t.returnDate !== null);
    return { currentLoans, loanHistory };
  }, [transactions]);

  if (!currentUser) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>Welcome, {currentUser.name}!</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label={`Currently Borrowed (${currentLoans.length})`} />
          <Tab label="Borrowing History" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {currentLoans.length > 0 ? (currentLoans.map(loan => {
            const dueDate = new Date(loan.dueDate);
            const isOverdue = new Date() > dueDate;
            return (
              <Grid item xs={12} sm={6} md={4} key={loan.id}>
                <Card sx={{ backgroundColor: isOverdue ? '#fff0f0' : 'white' }}>
                  <CardContent>
                    <Typography variant="h6">{loan.bookTitle}</Typography>
                    <Typography color="text.secondary">Issued: {new Date(loan.issueDate).toLocaleDateString()}</Typography>
                    <Typography color={isOverdue ? 'error' : 'text.primary'} sx={{ fontWeight: 'bold' }}>Due Date: {dueDate.toLocaleDateString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })) : (<Typography sx={{ p: 2 }}>You have no books currently borrowed.</Typography>)}
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {loanHistory.length > 0 ? (loanHistory.map(loan => (
          <Card key={loan.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{loan.bookTitle}</Typography>
              <Typography>Issued: {new Date(loan.issueDate).toLocaleDateString()}</Typography>
              <Typography>Returned: {new Date(loan.returnDate).toLocaleDateString()}</Typography>
              {loan.finePaid > 0 && (<Typography color="error.main">Fine Paid: ${loan.finePaid.toFixed(2)}</Typography>)}
            </CardContent>
          </Card>
        ))) : (<Typography>Your borrowing history is empty.</Typography>)}
      </TabPanel>
    </Box>
  );
}

export default StudentDashboardPage;