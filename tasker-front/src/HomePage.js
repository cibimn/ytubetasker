import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Check login status on component mount
    useEffect(() => {
        const checkLoggedInStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/check_auth_status/', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        // Check the login status when the component mounts
        checkLoggedInStatus();
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/users/user_logout/', {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            localStorage.removeItem('csrf');
            setIsLoggedIn(false);
            setShowModal(false);
            alert('User logged out successfully');
        } catch (error) {
            alert('An error occurred while logging out');
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="container mx-auto mt-10 text-center">
            <h1 className="mb-4 text-4xl font-bold">Welcome to Our Website</h1>
            <p className="mb-8 text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="space-x-4">
                {isLoggedIn ? (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link
                            to="/register"
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                        >
                            Log In
                        </Link>
                    </>
                )}
            </div>

            {/* Logout Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="p-8 bg-white rounded">
                        <h2 className="mb-4 text-2xl">Are you sure you want to logout?</h2>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
