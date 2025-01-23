import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = ({ onNavigateToLogin, baseURL }) => {
    const [Username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${baseURL}/api/register`, { Username, email, password });
            alert('Registrasi berhasil! Silakan login.');
            onNavigateToLogin();
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registrasi gagal. Coba lagi.');
        }
    };

    return (
        <div className="container my-5">
            <h2 className="text-center">Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nama</label>
                    <input
                        type="text"
                        id="name" z
                        className="form-control"
                        value={Username}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <p className="mt-3">
                Sudah punya akun?{' '}
                <span
                    className="text-primary"
                    style={{ cursor: 'pointer' }}
                    onClick={onNavigateToLogin}
                >
                    Login
                </span>
            </p>
        </div>
    );
};

export default RegisterPage;
