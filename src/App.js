// src/App.js
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import BookManagementPage from './components/BookManagementPage';
import StudentManagementPage from './components/StudentManagementPage';


const initialBooks = [
  { id: '978-0321765723', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', copies: 5 },
  { id: '978-0743273565', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', copies: 2 },
  { id: '978-1400033416', title: '1984', author: 'George Orwell', genre: 'Dystopian', copies: 8 },
  { id: '978-0451524935', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', copies: 0 },
  { id: '978-0140283334', title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', copies: 4 },
  { id: '978-1501175462', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'Non-Fiction', copies: 6 },
];

const initialStudents = [
  { id: 'S001', name: 'Alice Johnson', email: 'alice.j@university.edu', contact: '123-456-7890' },
  { id: 'S002', name: 'Bob Williams', email: 'bob.w@university.edu', contact: '234-567-8901' },
  { id: 'S003', name: 'Charlie Brown', email: 'charlie.b@university.edu', contact: '345-678-9012' },
  { id: 'S004', name: 'Diana Miller', email: 'diana.m@university.edu', contact: '456-789-0123' },
];

function App() {
  const [books, setBooks] = useState(initialBooks);
  const [students, setStudents] = useState(initialStudents);
  const [transactions, setTransactions] = useState([]);
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>

        <Route path="/dashboard" element={<DashboardPage books={books} students={students} setBooks={setBooks} transactions={transactions} setTransactions={setTransactions} />} />

        <Route path="/books" element={<BookManagementPage books={books} setBooks={setBooks} />} />

        <Route path="/students" element={<StudentManagementPage students={students} setStudents={setStudents} />} />
    </Route>

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;