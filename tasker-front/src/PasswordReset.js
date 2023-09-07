import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const PasswordReset = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/users/password_reset/', { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Password reset email sent.');
        } catch (error) {
            alert('An error occurred while sending the password reset email.');
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex flex-wrap justify-center w-1/2 m-auto">
                <form onSubmit={handleSubmit} className="p-4 m-3 bg-white rounded w-96">
                    <h1 className="w-full mb-4 text-4xl text-center">Password Reset</h1>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mt-1 border rounded-md"
                        />
                    </div>
                    <button type="submit" className="w-full p-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
