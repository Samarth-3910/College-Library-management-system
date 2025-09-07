// src/components/StudentDashboardPage.js
import React, { useState, useMemo, useContext } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Grid } from '@mui/material';
import AuthContext from '../context/AuthContext';

// A simple component for each tab's content
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function StudentDashboardPage({ transactions }) {
  const { currentUser } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter transactions for the current user using useMemo for efficiency
  const { currentLoans, loanHistory } = useMemo(() => {
    if (!currentUser) return { currentLoans: [], loanHistory: [] };

    const userTransactions = transactions.filter(t => t.studentId === currentUser.id);

    const currentLoans = userTransactions.filter(t => t.returnDate === null);
    const loanHistory = userTransactions.filter(t => t.returnDate !== null);

    return { currentLoans, loanHistory };
  }, [currentUser, transactions]);

  if (!currentUser) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser.name}!
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label={`Currently Borrowed (${currentLoans.length})`} />
          <Tab label="Borrowing History" />
        </Tabs>
      </Box>

      {/* Currently Borrowed Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {currentLoans.length > 0 ? (
            currentLoans.map(loan => {
              const dueDate = new Date(loan.dueDate);
              const isOverdue = new Date() > dueDate;
              return (
                <Grid item xs={12} sm={6} md={4} key={loan.id}>
                  <Card sx={{ backgroundColor: isOverdue ? '#fff0f0' : 'white' }}>
                    <CardContent>
                      <Typography variant="h6">{loan.bookTitle}</Typography>
                      <Typography color="text.secondary">
                        Issued: {new Date(loan.issueDate).toLocaleDateString()}
                      </Typography>
                      <Typography
                        color={isOverdue ? 'error' : 'text.primary'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Due Date: {dueDate.toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography sx={{ p: 2 }}>You have no books currently borrowed.</Typography>
          )}
        </Grid>
      </TabPanel>

      {/* Borrowing History Tab */}
      <TabPanel value={tabValue} index={1}>
        {loanHistory.length > 0 ? (
          loanHistory.map(loan => (
            <Card key={loan.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{loan.bookTitle}</Typography>
                <Typography>Issued: {new Date(loan.issueDate).toLocaleDateString()}</Typography>
                <Typography>Returned: {new Date(loan.returnDate).toLocaleDateString()}</Typography>
                {loan.finePaid > 0 && (
                  <Typography color="error.main">Fine Paid: ${loan.finePaid.toFixed(2)}</Typography>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>Your borrowing history is empty.</Typography>
        )}
      </TabPanel>
    </Box>
  );
}

export default StudentDashboardPage;