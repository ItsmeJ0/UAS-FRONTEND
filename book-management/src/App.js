import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const baseURL = 'http://localhost:3001'; // Arahkan ke port backend Go yang sudah Anda konfigurasikan
 // Tambahkan prefix API
// Sesuaikan dengan URL backend Anda
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '', genre: '' });
  const [editBook, setEditBook] = useState(null);

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
    if (!newBook.title || !newBook.author || !newBook.year || !newBook.genre) {
      alert('Semua kolom harus diisi!');
      return;
    }
    
    console.log("Data yang akan dikirim:", newBook);  // Log data yang akan dikirimkan ke backend
    try {
      await axios.post(`${baseURL}/api/books`, newBook);
      setBooks([...books, newBook]); // Update local state
      setNewBook({ title: '', author: '', year: '', genre: '' });
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Gagal menambahkan buku');
    }
  };
  

  // Delete a book
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;
    try {
      await axios.delete(`${baseURL}/api/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Gagal menghapus buku');
    }
  };

  // Start editing a book
  const handleEditClick = (book) => {
    setEditBook(book);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditBook(null);
  };

  // Update book details
  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/books/${editBook.id}`, editBook);
      setBooks(books.map((book) => (book.id === editBook.id ? editBook : book)));
      setEditBook(null);
    } catch (error) {
      console.error('Error editing book:', error);
      alert('Gagal memperbarui buku');
    }
  };

  // Handle edit input changes
  const handleEditInputChange = (e) => {
    const { id, value } = e.target;
    setEditBook({
      ...editBook,
      [id]: value,
    });
  };

  return (
    <div className="container my-5">
      <h1 className="text-center">Manajemen Buku</h1>

      {/* Add Book Form */}
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

      {/* Edit Book Form */}
      {editBook && (
        <form onSubmit={handleEditBook} className="mb-4">
          <h2>Edit Buku</h2>
          <div className="mb-3">
            <label htmlFor="editTitle" className="form-label">Judul</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={editBook.title}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="editAuthor" className="form-label">Penulis</label>
            <input
              type="text"
              id="author"
              className="form-control"
              value={editBook.author}
              onChange={handleEditInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Update Buku</button>
          <button
            type="button"
            className="btn btn-secondary ms-3"
            onClick={handleCancelEdit}
          >
            Batal
          </button>
        </form>
      )}

      {/* Book List */}
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
                  onClick={() => handleEditClick(book)}
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
    </div>
  );
};

export default App;
