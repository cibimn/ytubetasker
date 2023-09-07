import React from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import './axiosConfig';
import Cookies from 'js-cookie';


const UserLogout = () => {

    const csrfToken = Cookies.get('csrftoken');
    
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/users/user_logout/', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                withCredentials: true
            });
            alert('User logged out successfully');
        } catch (error) {
            alert('An error occurred while logging out');
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex flex-wrap justify-center w-1/2 m-auto">
                <div className="p-4 m-3 bg-white rounded w-96">
                    <h1 className="w-full mb-4 text-4xl text-center">Logout</h1>
                    {/* Logout Button */}
                    <button onClick={handleLogout} className="w-full p-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserLogout;
