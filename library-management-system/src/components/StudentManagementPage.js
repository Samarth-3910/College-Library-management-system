// StudentManagementPage.js - Fetches and manages its own data from the API
import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function StudentManagementPage() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({ id: '', name: '', email: '', contact: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/students')
      .then(response => response.json())
      .then(data => setStudents(data))
      .catch(error => console.error("Error fetching students:", error));
  }, []);

  const handleClickOpen = () => {
    setEditingStudent(null);
    setNewStudentData({ id: '', name: '', email: '', contact: '' });
    setOpen(true);
  };

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
    setNewStudentData({ id: student.id, name: student.name, email: student.email, contact: student.contact });
    setOpen(true);
  };

  const handleDeleteClick = (studentId) => {
    setStudentToDeleteId(studentId);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setStudentToDeleteId(null);
  };

  const handleFormSubmit = async () => {
    const url = editingStudent ? `http://localhost:8080/api/students/${editingStudent.id}` : 'http://localhost:8080/api/students';
    const method = editingStudent ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentData),
      });
      const savedStudent = await response.json();

      if (editingStudent) {
        setStudents(prev => prev.map(s => (s.id === editingStudent.id ? savedStudent : s)));
      } else {
        setStudents(prev => [...prev, savedStudent]);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://localhost:8080/api/students/${studentToDeleteId}`, { method: 'DELETE' });
      setStudents(prev => prev.filter(s => s.id !== studentToDeleteId));
      handleCloseConfirm();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const studentColumns = [
    { field: 'id', headerName: 'Student ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'email', headerName: 'Email', width: 300 },
    { field: 'contact', headerName: 'Contact Number', width: 200 },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}><DeleteIcon color="error" /></IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Student Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>Register New Student</Button>
      </Box>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={students} columns={studentColumns} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Paper>
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
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to remove this student?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentManagementPage;