import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditBookPage from './components/EditBookPage';
import LoginPage from './components/LoginPage';

const App = () => {
  const baseURL = 'http://localhost:3001'; // URL backend
  const [currentPage, setCurrentPage] = useState('login'); // Halaman aktif
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Status login
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '', genre: '' });
  const [editBookId, setEditBookId] = useState(null); // ID buku untuk diedit

  // Cek token saat aplikasi dimulai
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('home');
    }
  }, []);

  // Fetch books from backend
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        const response = await axios.get(`${baseURL}/api/books`, {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan header Authorization
          },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    if (isAuthenticated) {
      loadBooks();
    }
  }, [isAuthenticated]);

  // Handle form input changes for adding a new book
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewBook({
      ...newBook,
      [id]: value,
    });
  };

  // Add a new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      await axios.post(`${baseURL}/api/books`, newBook, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await axios.get(`${baseURL}/api/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(response.data);
      setNewBook({ title: '', author: '', year: '', genre: '' });
      alert('Buku berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Gagal menambahkan buku');
    }
  };

  // Delete a book
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;
    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage
      await axios.delete(`${baseURL}/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Gagal menghapus buku');
    }
  };

  // Navigasi antar halaman
  const navigateTo = (page, bookId = null) => {
    setCurrentPage(page);
    setEditBookId(bookId); // Set ID buku untuk halaman edit
  };

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}/api/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token); // Simpan token di localStorage
      setIsAuthenticated(true);
      setCurrentPage('home');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login gagal. Periksa email dan password Anda.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari localStorage
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  return (
    <div className="container my-5">
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'home' && isAuthenticated && (
        <>
          <h1 className="text-center">Manajemen Buku</h1>
          <button className="btn btn-danger mb-3" onClick={handleLogout}>
            Logout
          </button>

          {/* Form Tambah Buku */}
          <form onSubmit={handleAddBook} className="mb-4">
            <h2>Tambah Buku</h2>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Judul</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={newBook.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">Penulis</label>
              <input
                type="text"
                id="author"
                className="form-control"
                value={newBook.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="year" className="form-label">Tahun</label>
              <input
                type="number"
                id="year"
                className="form-control"
                value={newBook.year}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="genre" className="form-label">Genre</label>
              <input
                type="text"
                id="genre"
                className="form-control"
                value={newBook.genre}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Tambah Buku</button>
          </form>

          {/* Daftar Buku */}
          <h2>Daftar Buku</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Judul</th>
                <th>Penulis</th>
                <th>Tahun</th>
                <th>Genre</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.year}</td>
                  <td>{book.genre}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigateTo('edit-book', book.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {currentPage === 'edit-book' && isAuthenticated && editBookId && (
        <EditBookPage bookId={editBookId} navigateTo={navigateTo} baseURL={baseURL} />
      )}
    </div>
  );
};

export default App;
