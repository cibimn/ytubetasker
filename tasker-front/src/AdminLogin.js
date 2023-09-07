import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/admin_signup/api/admin_login/', formData);
            alert('Logged in successfully');
        } catch (error) {
            alert('Invalid credentials');
        }
    };

    return (
        <div>
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
