import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography, Box, Paper, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, IconButton, Grid, Card, CardContent, CardActions,
    Avatar, ToggleButtonGroup, ToggleButton, InputAdornment, Select,
    MenuItem, FormControl, InputLabel, Fab, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DownloadIcon from '@mui/icons-material/Download';
import BadgeIcon from '@mui/icons-material/Badge';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '20px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
}));

const StudentCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '15px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    }
}));

const StudentAvatar = styled(Avatar)(({ theme }) => ({
    width: 80,
    height: 80,
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontSize: '2rem',
    fontWeight: 'bold',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 'bold',
}));

const FilterChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    borderRadius: '10px',
}));

function StudentManagementPage() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [open, setOpen] = useState(false);
    const [newStudentData, setNewStudentData] = useState({
        id: '', name: '', email: '', contact: ''
    });
    const [editingStudent, setEditingStudent] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [studentToDeleteId, setStudentToDeleteId] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/students');
            const data = await response.json();
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    // Apply search filter
    useEffect(() => {
        let filtered = students;

        if (searchTerm) {
            filtered = filtered.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (student.contact && student.contact.includes(searchTerm))
            );
        }

        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    const clearFilters = () => {
        setSearchTerm('');
    };

    const hasActiveFilters = searchTerm;

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
        setNewStudentData({
            id: student.id,
            name: student.name,
            email: student.email,
            contact: student.contact
        });
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
        const url = editingStudent
            ? `http://localhost:8080/api/students/${editingStudent.id}`
            : 'http://localhost:8080/api/students';
        const method = editingStudent ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudentData),
            });
            const savedStudent = await response.json();

            if (editingStudent) {
                setStudents(prev =>
                    prev.map(s => (s.id === editingStudent.id ? savedStudent : s))
                );
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
            await fetch(`http://localhost:8080/api/students/${studentToDeleteId}`, {
                method: 'DELETE'
            });
            setStudents(prev => prev.filter(s => s.id !== studentToDeleteId));
            handleCloseConfirm();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const exportToCSV = () => {
        const headers = ['Student ID', 'Name', 'Email', 'Contact'];
        const csvData = filteredStudents.map(student => [
            student.id,
            student.name,
            student.email,
            student.contact || 'N/A'
        ]);

        const csv = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students_export.csv';
        a.click();
    };

    // Get initials for avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const studentColumns = [
        { field: 'id', headerName: 'Student ID', width: 130 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        { field: 'contact', headerName: 'Contact', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleEditClick(params.row)} size="small">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row.id)} size="small">
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                    Student Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage library members and registrations
                </Typography>
            </Box>

            {/* Toolbar */}
            <StyledPaper sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Search */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search by name, email, ID, or contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            {hasActiveFilters && (
                                <ActionButton
                                    variant="outlined"
                                    startIcon={<ClearIcon />}
                                    onClick={clearFilters}
                                >
                                    Clear
                                </ActionButton>
                            )}
                            <ActionButton
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={exportToCSV}
                            >
                                Export
                            </ActionButton>
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                                size="small"
                            >
                                <ToggleButton value="grid">
                                    <ViewModuleIcon />
                                </ToggleButton>
                                <ToggleButton value="table">
                                    <ViewListIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                </Grid>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                            Active filters:
                        </Typography>
                        {searchTerm && (
                            <FilterChip
                                label={`Search: "${searchTerm}"`}
                                onDelete={() => setSearchTerm('')}
                                size="small"
                            />
                        )}
                    </Box>
                )}
            </StyledPaper>

            {/* Results Count */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {filteredStudents.length} of {students.length} students
                </Typography>
            </Box>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <Grid container spacing={3}>
                    {filteredStudents.map((student) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
                            <StudentCard>
                                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                                    <StudentAvatar>
                                        {getInitials(student.name)}
                                    </StudentAvatar>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {student.name}
                                    </Typography>

                                    <Box sx={{ mb: 2, textAlign: 'left' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <BadgeIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {student.id}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {student.email}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {student.contact || 'No contact'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <ActionButton
                                        size="small"
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditClick(student)}
                                    >
                                        Edit
                                    </ActionButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(student.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </StudentCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <StyledPaper>
                    <div style={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={filteredStudents}
                            columns={studentColumns}
                            pageSize={10}
                            pageSizeOptions={[10, 25, 50]}
                            disableRowSelectionOnClick
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-cell:focus': {
                                    outline: 'none'
                                }
                            }}
                        />
                    </div>
                </StyledPaper>
            )}

            {/* Floating Add Button */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}
            >
                <AddIcon />
            </Fab>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingStudent ? 'Edit Student' : 'Register New Student'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="id"
                        label="Student ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newStudentData.id}
                        onChange={handleInputChange}
                        disabled={!!editingStudent}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="name"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newStudentData.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newStudentData.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="contact"
                        label="Contact Number"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newStudentData.contact}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <ActionButton onClick={handleClose} variant="outlined">
                        Cancel
                    </ActionButton>
                    <ActionButton onClick={handleFormSubmit} variant="contained">
                        {editingStudent ? 'Save Changes' : 'Register Student'}
                    </ActionButton>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove this student? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <ActionButton onClick={handleCloseConfirm} variant="outlined">
                        Cancel
                    </ActionButton>
                    <ActionButton onClick={handleConfirmDelete} variant="contained" color="error">
                        Delete
                    </ActionButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default StudentManagementPage;