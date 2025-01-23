import React, { useState } from 'react';

const LoginPage = ({ onLogin, onNavigateToRegister }) => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(Email, Password);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="Email" className="form-label">Email</label>
          <input
            type="Email"
            id="Email"
            className="form-control"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Password" className="form-label">Password</label>
          <input
            type="Password"
            id="Password"
            className="form-control"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p className="mt-3">
        Belum punya akun?{' '}
        <span
          className="text-primary"
          style={{ cursor: 'pointer' }}
          onClick={onNavigateToRegister}
        >
          Buat Akun
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
