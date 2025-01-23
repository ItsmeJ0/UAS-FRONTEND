import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditBookPage = ({ bookId, navigateTo, baseURL }) => {
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  // Fetch book details based on ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/books/${bookId}`);
        setBook(response.data);
      } catch (err) {
        setError('Gagal memuat data buku. Pastikan buku tersedia.');
      }
    };

    fetchBook();
  }, [bookId, baseURL]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setBook({
      ...book,
      [id]: value,
    });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/api/books/${book.id}`, book);
      alert('Buku berhasil diperbarui!');
      navigateTo('home'); // Kembali ke halaman utama setelah edit selesai
    } catch (err) {
      setError('Gagal memperbarui buku. Silakan coba lagi.');
    }
  };

  if (!book) return <p>Memuat data buku...</p>;

  return (
    <form onSubmit={handleUpdateBook} className="container mt-5">
      <h2>Edit Buku</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Judul</label>
        <input
          type="text"
          id="title"
          className="form-control"
          value={book.title}
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
          value={book.author}
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
          value={book.year}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="genre" className="form-label">Genre</label>
        <input
          type="text"
          id="genre"
          className="form-control"
          value={book.genre}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" className="btn btn-success">Simpan</button>
      <button
        type="button"
        className="btn btn-secondary ms-3"
        onClick={() => navigateTo('home')}
      >
        Batal
      </button>
    </form>
  );
};

export default EditBookPage;
