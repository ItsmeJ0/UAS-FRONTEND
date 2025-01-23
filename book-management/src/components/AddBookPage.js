import React from 'react';

const AddBookPage = ({ newBook, handleInputChange, handleAddBook, navigateTo }) => (
  <form onSubmit={handleAddBook}>
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
    <button
      type="button"
      className="btn btn-secondary ms-3"
      onClick={() => navigateTo('home')}
    >
      Kembali
    </button>
  </form>
);

export default AddBookPage;
