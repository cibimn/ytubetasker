
import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const UserSignup = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const { first_name, last_name, email, password } = formData;  // Destructure to pick required fields
        const sendData = { first_name, last_name, email, password }; 
        try {
            await axios.post('http://localhost:8000/api/users/user_signup/', sendData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('User account created successfully');
        } catch (error) {
            alert('An error occurred while creating the user account');
            console.error('There was an error!', error);
        }
    };

    // Password strength indicator logic
    let passwordStrength = 0;
    if (formData.password.length >= 8) passwordStrength = 4;
    else if (formData.password.length >= 6) passwordStrength = 3;
    else if (formData.password.length >= 4) passwordStrength = 2;
    else if (formData.password.length > 0) passwordStrength = 1;

    const passwordStrengthText = passwordStrength < 2 ? 'Weak' : 'Strong';
    return (
        <div class="login">
            <div className="flex h-screen bg-gray-100">
                <div className="m-auto w-1/2 flex flex-wrap justify-center">
                    <form onSubmit={handleSubmit} className="m-3 w-96 bg-white rounded p-4">
                        <h1 className="w-full text-4xl text-center mb-4">Register</h1>
                        {/* First Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">First Name</label>
                            <input type="text" name="first_name" onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md" />
                        </div>
                        {/* Last Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Last Name</label>
                            <input type="text" name="last_name" onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md" />
                        </div>
                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input type="email" name="email" onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md" />
                        </div>
                        <input type="password" name="password" placeholder="Password" onChange={handleChange}
                            className="mt-1 p-2 w-full mb-1 border rounded-md" />
                        {/* Password strength indicator */}
                        <div className="mb-1 grid grid-cols-4 gap-1">
                            {Array.from({ length: 4 }, (_, i) => (
                                <div key={i} className={`h-2 ${i < passwordStrength ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            ))}
                        </div>
                        <div className="mb-4 text-sm text-gray-600">
                            {passwordStrengthText}
                        </div>
                        {/* Confirm Password field */}
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange}
                            className="mt-1 p-2 w-full mb-4 border rounded-md" />
                        {/* Buttons */}
                        <button type="submit" className="w-full p-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                            Register
                        </button>
                        <button type="button" className="w-full p-2 text-white bg-green-500 rounded-md hover:bg-green-600">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
    );
};

export default UserSignup;

