# 📚 Modern Library Management System V-1

This is a web application designed to help librarians manage their library's books and student records efficiently. It's built from the ground up using modern web technologies like React, providing a fast, responsive, and user-friendly experience.

The goal of this project is to create a feature-rich, premium-looking system that simplifies the daily tasks of library management.

---

## ✨ Key Features (So Far)

We have successfully built the core system (Phase 1) and the essential transaction features (Phase 2).

### Core Features:
*   **👤 Secure Login:** A clean and simple login page for staff.
*   **📊 Librarian Dashboard:** A home screen with key statistics at a glance:
    *   Summary cards for Total Books, Total Members, etc.
    *   Quick action buttons for common tasks.
*   **📖 Full Book Management (CRUD):**
    *   **View** all books in a powerful, sortable, and searchable table.
    *   **Add** new books to the library through a user-friendly pop-up form.
    *   **Edit** existing book details (like title, author, or copy count).
    *   **Delete** books from the system with a confirmation step to prevent accidents.
*   **🧑‍🎓 Full Student Management (CRUD):**
    *   **View** all registered students in a clean table.
    *   **Register** new students with their essential details.
    *   **Update** student information as needed.
    *   **Remove** students from the system.

### Transactional Features:
*   **➡️ Book Issuance:**
    *   Librarians can easily issue a book to a student using smart search fields for both books and students.
    *   The system only shows books that are currently available (have more than 0 copies).
    *   When a book is issued, its **available copy count automatically decreases by one.**
*   **⬅️ Book Return:**
    *   A simple interface to process book returns.
    *   The system intelligently shows only the books that are currently checked out.
    *   When a book is returned, its **available copy count automatically increases by one.**
*   **📈 Transaction Tracking:**
    *   Every time a book is issued or returned, a transaction record is created and stored, forming a complete borrowing history.

---

## ⚙️ Technology Stack

This project is built with a modern frontend stack, focused on performance and a great developer experience.

*   **Frontend:** [React.js](https://reactjs.org/)
*   **UI Component Library:** [Material-UI (MUI)](https://mui.com/) - For that sleek, professional look and feel.
*   **Routing:** [React Router DOM](https://reactrouter.com/) - To create a seamless multi-page experience without page reloads.
*   **Data Tables:** [MUI X DataGrid](https://mui.com/x/react-data-grid/) - For powerful and interactive data tables.
*   **Development Environment:** Node.js, npm

---

## 🚀 Getting Started

Want to run this project on your own machine? Just follow these simple steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your computer. This will also install `npm` (Node Package Manager).

### Installation & Setup

1.  **Clone the repository** to your local machine:
    ```bash
    https://github.com/Samarth-3910/College-Library-management-system.git
    ```

2.  **Navigate into the project folder:**
    ```bash
    cd library-management-system
    ```

3.  **Install all the necessary dependencies:**
    (This command reads the `package.json` file and downloads all the required libraries like React, MUI, etc.)
    ```bash
    npm install
    ```

4.  **Start the application:**
    (This runs the app in development mode.)
    ```bash
    npm start
    ```

5.  Open your web browser and go to **http://localhost:3000** to see the application live!

---

## 🔮 Future Goals (What's Next!)

The foundation is solid, and we're ready to build more advanced features:
*   **Fine Calculation:** Automatically calculate and display fines for overdue books during the return process.
*   **Student Dashboard:** A dedicated view for students to log in and see their own borrowing history and due dates.
*   **Book Reservation:** Allow students to reserve a book that is currently checked out.
*   **Enhanced Reporting:** Create analytics pages for the librarian, showing popular books and more.
*   **QR Code Integration:** For lightning-fast checkouts and returns using a scanner.
