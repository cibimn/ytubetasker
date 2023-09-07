import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="container mx-auto mt-10 text-center">
            <h1 className="mb-4 text-4xl font-bold">Welcome to Our Website</h1>
            <p className="mb-8 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna eros. Duis malesuada metus orci, sit amet cursus lectus condimentum a.
            </p>
            <div className="space-x-4">
                <Link to="/register" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                    Sign Up
                </Link>
                <Link to="/login" className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
                    Log In
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
