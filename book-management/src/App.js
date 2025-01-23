import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import AddBookPage from './components/AddBookPage';

const App = () => {
  const baseURL = 'http://localhost:3001'; // Ganti dengan URL backend Anda
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '', genre: '' });
  const [editBook, setEditBook] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // Halaman default

  const navigateTo = (page) => setCurrentPage(page);

  // Fetch books from backend
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/books`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };
    loadBooks();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewBook({ ...newBook, [id]: value });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/api/books`, newBook);
      setNewBook({ title: '', author: '', year: '', genre: '' });
      navigateTo('home');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center">Manajemen Buku</h1>
      {currentPage === 'home' && (
        <HomePage
          books={books}
          handleEditClick={setEditBook}
          handleDeleteBook={(id) => setBooks(books.filter((book) => book.id !== id))}
          navigateTo={navigateTo}
        />
      )}
      {currentPage === 'add' && (
        <AddBookPage
          newBook={newBook}
          handleInputChange={handleInputChange}
          handleAddBook={handleAddBook}
          navigateTo={navigateTo}
        />
      )}
    </div>
  );
};

export default App;
