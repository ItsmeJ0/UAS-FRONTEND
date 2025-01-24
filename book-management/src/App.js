import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditBookPage from './components/EditBookPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const App = () => {
  const baseURL = 'http://localhost:3001'; // URL backend
  const [currentPage, setCurrentPage] = useState('login'); // Halaman aktif
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Status login
  const [books, setBooks] = useState([]);
  const [editBookId, setEditBookId] = useState(null); // ID buku untuk diedit
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '', genre: '' });
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [ws, setWs] = useState(null); // WebSocket connection

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('home');
    }
  }, []);

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:3001/ws');
  
      socket.onopen = () => {
        console.log('WebSocket connection established');
        setWs(socket); // Simpan koneksi di state
      };
  
      socket.onmessage = (event) => {
        console.log('Received message:', event.data);
        setAnnouncements((prevAnnouncements) => [
          ...prevAnnouncements,
          event.data,
        ]);
      };
  
      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };
  
      return socket;
    };
  
    const socket = connectWebSocket();
  
    return () => {
      socket.close(); // Tutup WebSocket ketika komponen dibongkar
    };
  }, [ws]);
  


  // Handle add announcement
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${baseURL}/api/announcement`,
        { message: newAnnouncement }, // Ganti content menjadi message
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewAnnouncement('');
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Gagal menambahkan pengumuman');
    }
  };

  // Cek token saat aplikasi dimulai
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('home');
    }
  }, []);

  // Fetch books dari backend jika user login
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
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


  // Tambahkan buku baru
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
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

  // Hapus buku
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;
    try {
      const token = localStorage.getItem('token');
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
    setEditBookId(bookId);
  };
  
  // Handle login
  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}/api/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setCurrentPage('home');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login gagal. Periksa email dan password Anda.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  return (
    <div className="container my-5">
      {/* Halaman Login */}
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}

      {/* Halaman Register */}
      {currentPage === 'register' && (
        <RegisterPage
          onNavigateToLogin={() => setCurrentPage('login')}
          baseURL={baseURL}
        />
      )}

      {/* Halaman Home (Manajemen Buku dan Pengumuman) */}
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
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
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
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
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
                onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="genre" className="form-label">Genre</label>
              <input
                type="text"
                id="genre"
                className="form-control"
                value={newBook.genre}
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Tambah Buku</button>
          </form>


          <div className="container my-5">
            {/* Other parts of your app */}
            {currentPage === 'home' && isAuthenticated && (
              <>
                {/* Form untuk pengumuman */}
                <form onSubmit={handleAddAnnouncement} className="mb-4">
                  <h2>Tambah Pengumuman</h2>
                  <div className="mb-3">
                    <label htmlFor="announcement" className="form-label">Pengumuman</label>
                    <input
                      type="text"
                      id="announcement"
                      className="form-control"
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Tambah Pengumuman</button>
                </form>

                {/* Daftar Pengumuman */}
                <h2>Daftar Pengumuman</h2>
                <ul className="list-group">
                  {announcements.map((announcement, index) => (
                    <li key={index} className="list-group-item">
                      {announcement}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

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

      {/* Halaman Edit Buku */}
      {currentPage === 'edit-book' && isAuthenticated && editBookId && (
        <EditBookPage bookId={editBookId} navigateTo={navigateTo} baseURL={baseURL} />
      )}
    </div>
  );
};

export default App;
