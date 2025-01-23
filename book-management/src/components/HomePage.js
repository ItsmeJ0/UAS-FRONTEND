import React from 'react';

const HomePage = ({ books, handleEditClick, handleDeleteBook, navigateTo }) => (
  <>
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
    <button className="btn btn-primary mt-3" onClick={() => navigateTo('add')}>
      Tambah Buku
    </button>
  </>
);

export default HomePage;
