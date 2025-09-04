// src/components/BookManagementPage.js
import React, { useState } from 'react';

import { Typography, Box, Paper, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; 
import AddIcon from '@mui/icons-material/Add';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

// STEP 2: Create some mock data.
// In a real app, you would fetch this from an API.
// IMPORTANT: Each object MUST have a unique `id` property. DataGrid uses this.
function StudentManagementPage({ students, setStudents }) {
  const [open, setOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
        id: '',
        name: '',
        email: '',
        contact: '',
  });
  const [editingStudent, setEditingStudent] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState(null);

  // Function to open the modal
  const handleClickOpen = () => {
      setEditingStudent(null); // Make sure we are in "add" mode
      setNewStudentData({      // Clear the form for the new entry
          id: '',
          name: '',
          email: '',
          contact: '',
      });
      setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
      setOpen(false);
      setEditingStudent(null);
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewStudentData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (student) => {
      setEditingStudent(student);
      setNewStudentData({
            id: student.id,
            name: student.name,
            email: student.email,
            contact: student.contact,
      });
      setOpen(true); // Open the modal
  };

    const handleFormSubmit = () => {
       if (editingStudent) {
      // --- UPDATE LOGIC ---
      setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === editingStudent.id ? { ...newStudentData } : student
          )
      );
  } else {
       setStudents(prevStudents => [...prevStudents, { ...newStudentData }]);
    }
      handleClose();
  };

  const handleDeleteClick = (bookId) => {
      setStudentToDeleteId(bookId);
      setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
      setConfirmOpen(false);      // Close the dialog
      setStudentToDeleteId(null);    // Clear the stored ID
  };

  const handleConfirmDelete = () => {
       setStudents(prevStudents => prevStudents.filter(student => student.id !== studentToDeleteId));
      handleCloseConfirm();
  };



const studentColumns = (handleEditClick, handleDeleteClick) => [
    { field: 'id', headerName: 'Student ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'email', headerName: 'Email', width: 300 },
    { field: 'contact', headerName: 'Contact Number', width: 200 },

    {
          field: 'actions',
          headerName: 'Actions',
          width: 150,
          sortable: false, // Actions column shouldn't be sortable
          renderCell: (params) => {
              // `params.row` contains the data for the entire row
              return (
                  <>
                      <IconButton onClick={() => handleEditClick(params.row)}>
                          <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(params.row.id)}>
                          <DeleteIcon color="error" />
                      </IconButton>
                  </>
              );
          },
      },
  ];

return (
    <Box>
        {/* --- PAGE HEADER --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom>
                Student Management
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
                Register New Student
            </Button>
        </Box>

        {/* --- DATA GRID --- */}
        <Paper sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={students}
                columns={studentColumns(handleEditClick, handleDeleteClick)}
                pageSizeOptions={[10, 25]}
                disableRowSelectionOnClick
            />
        </Paper>

        {/* --- ADD/EDIT DIALOG --- */}
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editingStudent ? 'Edit Student' : 'Register New Student'}</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" name="id" label="Student ID" type="text" fullWidth variant="outlined" value={newStudentData.id} onChange={handleInputChange} disabled={!!editingStudent} />
                <TextField margin="dense" name="name" label="Full Name" type="text" fullWidth variant="outlined" value={newStudentData.name} onChange={handleInputChange} />
                <TextField margin="dense" name="email" label="Email Address" type="email" fullWidth variant="outlined" value={newStudentData.email} onChange={handleInputChange} />
                <TextField margin="dense" name="contact" label="Contact Number" type="text" fullWidth variant="outlined" value={newStudentData.contact} onChange={handleInputChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleFormSubmit}>{editingStudent ? 'Save Changes' : 'Register Student'}</Button>
            </DialogActions>
        </Dialog>

        {/* --- DELETE CONFIRMATION DIALOG --- */}
        <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to remove this student? This will also remove their borrowing history.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirm}>Cancel</Button>
                <Button onClick={handleConfirmDelete} color="error" autoFocus>Delete</Button>
            </DialogActions>
        </Dialog>
    </Box>
);
}

export default StudentManagementPage;