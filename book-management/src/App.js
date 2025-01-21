import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: '', genre: '' });
  const [editBook, setEditBook] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewBook({
      ...newBook,
      [id]: value
    });
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { id, value } = e.target;
    setEditBook({
      ...editBook,
      [id]: value
    });
  };

  // Add new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      // Make an API call or use state to add the book
      const updatedBooks = [...books, { ...newBook, id: books.length + 1 }];
      setBooks(updatedBooks);
      setNewBook({ title: '', author: '', year: '', genre: '' });
    } catch (error) {
      console.error("Error adding book", error);
    }
  };

  // Edit book
  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      const updatedBooks = books.map((book) =>
        book.id === editBook.id ? editBook : book
      );
      setBooks(updatedBooks);
      setEditBook(null);
    } catch (error) {
      console.error("Error editing book", error);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditBook(null);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center">Book Management</h1>

      {/* Add Book Form */}
      <div className="card my-4">
        <div className="card-body">
          <h5 className="card-title">Tambah Buku</h5>
          <form onSubmit={handleAddBook}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Judul</label>
              <input type="text" className="form-control" id="title" value={newBook.title} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">Penulis</label>
              <input type="text" className="form-control" id="author" value={newBook.author} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="year" className="form-label">Tahun</label>
              <input type="number" className="form-control" id="year" value={newBook.year} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="genre" className="form-label">Genre</label>
              <input type="text" className="form-control" id="genre" value={newBook.genre} onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn btn-primary">Tambah Buku</button>
          </form>
        </div>
      </div>

      {/* Edit Book Form */}
      {editBook && (
        <form onSubmit={handleEditBook} className="card my-4 p-3">
          <h5 className="card-title">Edit Buku</h5>
          <div className="mb-3">
            <input type="hidden" id="editBookId" value={editBook.id} />
            <label htmlFor="editTitle" className="form-label">Judul</label>
            <input type="text" id="editTitle" className="form-control" value={editBook.title} onChange={handleEditInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="editAuthor" className="form-label">Penulis</label>
            <input type="text" id="editAuthor" className="form-control" value={editBook.author} onChange={handleEditInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="editYear" className="form-label">Tahun</label>
            <input type="number" id="editYear" className="form-control" value={editBook.year} onChange={handleEditInputChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="editGenre" className="form-label">Genre</label>
            <input type="text" id="editGenre" className="form-control" value={editBook.genre} onChange={handleEditInputChange} />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">Update Buku</button>
            <button type="button" onClick={cancelEdit} className="btn btn-secondary">Batal</button>
          </div>
        </form>
      )}

      {/* Book List */}
      <div>
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
            {books.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Memuat data...</td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.year}</td>
                  <td>{book.genre}</td>
                  <td>
                    <button onClick={() => setEditBook(book)} className="btn btn-warning">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
