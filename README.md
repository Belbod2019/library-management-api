# School Library Management API

A comprehensive RESTful API for managing a school library system built with Node.js, Express, and MongoDB.

## Features

### Core Features
- **Author Management**: Create, read, update, and delete authors
- **Book Management**: Full CRUD operations with multiple authors support
- **Student Management**: Manage student records
- **Library Attendant Management**: Manage staff records
- **Book Borrowing & Returning**: Complete borrow/return workflow with tracking

### Bonus Features
- **JWT Authentication**: Secure protected routes with JSON Web Tokens
- **Pagination**: GET /books with page and limit parameters
- **Search**: Search books by title or author name
- **Overdue Tracking**: Check for overdue books
- **Data Population**: Automatically populate referenced documents

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Belbod2019/library-management-api.git
cd library-management-api