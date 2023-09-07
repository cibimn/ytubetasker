import React, { useState } from 'react';
import axios from 'axios';

const AdminSignup = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'ADMIN' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/users/user_signup/', formData);
            alert('User account created successfully');
        } catch (error) {
            alert('An error occurred while creating the User account');
        }
    };

    return (
        <div>
            <h1>Admin Signup</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default AdminSignup;
