import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import './axiosConfig';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        try {
            await axios.post('http://localhost:8000/api/users/user_login/', { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            alert('User logged in successfully');
            navigate('/');
        } catch (error) {
            alert('An error occurred while logging in');
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex flex-wrap justify-center w-1/2 m-auto">
                <form onSubmit={handleSubmit} className="p-4 m-3 bg-white rounded w-96">
                    <h1 className="w-full mb-4 text-4xl text-center">Login</h1>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input type="email" name="email" onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input type="password" name="password" onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                    {/* Buttons */}
                    <button type="submit" className="w-full p-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
