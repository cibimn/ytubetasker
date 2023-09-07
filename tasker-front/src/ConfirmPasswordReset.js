import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import { useParams } from 'react-router-dom';

const ConfirmPasswordReset = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/users/password_reset_confirm/', { token:token, new_password: newPassword }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Password successfully updated.');
        } catch (error) {
            alert('An error occurred while updating the password.');
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex flex-wrap justify-center w-1/2 m-auto">
                <form onSubmit={handleSubmit} className="p-4 m-3 bg-white rounded w-96">
                    <h1 className="w-full mb-4 text-4xl text-center">Confirm Password Reset</h1>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">New Password</label>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 mt-1 border rounded-md"
                        />
                    </div>
                    <button type="submit" className="w-full p-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                        Confirm
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmPasswordReset;
