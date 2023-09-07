import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const UserSignup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
        try {
            await axios.post('http://localhost:8000/api/users/user_signup/', formData);
            alert('User account created successfully');
        } catch (error) {
            alert('An error occurred while creating the user account');
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
                            <input type="text" name="firstName" onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md" />
                        </div>
                        {/* Last Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Last Name</label>
                            <input type="text" name="lastName" onChange={handleChange}
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


// import React, { useState } from 'react';
// import axios from 'axios';
// import 'tailwindcss/tailwind.css';
// import myImage from './images/illustration.svg';
// import logo from './images/logo.svg';

// const UserSignup = () => {
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (formData.password !== formData.confirmPassword) {
//             alert('Passwords do not match');
//             return;
//         }
//         try {
//             await axios.post('http://localhost:8000/api/users/user_signup/', formData);
//             alert('User account created successfully');
//         } catch (error) {
//             alert('An error occurred while creating the user account');
//         }
//     };

//     // Password strength indicator logic
//     let passwordStrength = 0;
//     if (formData.password.length >= 8) passwordStrength = 4;
//     else if (formData.password.length >= 6) passwordStrength = 3;
//     else if (formData.password.length >= 4) passwordStrength = 2;
//     else if (formData.password.length > 0) passwordStrength = 1;

//     const passwordStrengthText = passwordStrength < 2 ? 'Weak' : 'Strong';
//     return (
//         <div class="login">
//             <div class="container sm:px-10">
//                 <div class="block xl:grid grid-cols-2 gap-4">
//                     <div class="hidden xl:flex flex-col min-h-screen">
//                         <a href="/" class="-intro-x flex items-center pt-5">
//                             <img alt="Midone - HTML Admin Template" class="w-6" src={logo}/>
//                             <span class="text-white text-lg ml-3"> Enigma </span> 
//                         </a>
//                         <div class="my-auto">
//                             <img alt="YtubeTasker" class="-intro-x w-1/2 -mt-16" src={myImage}/>
//                             <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
//                                 A few more clicks to 
//                                 <br/>
//                                 sign up to your account.
//                             </div>
//                             <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">Manage all your Youtube Uploads in one place</div>
//                         </div>
//                     </div>
//                     <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
//                         <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
//                             <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
//                                 Sign Up
//                             </h2>
//                             <div class="intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center">A few more clicks to sign in to your account. Manage all your youtube videos in one place</div>
//                                 <div class="intro-x mt-8">
//                                     <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="intro-x login__input form-control py-3 px-4 block" />
//                                     <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="intro-x login__input form-control py-3 px-4 block mt-4" />
//                                     <input type="text" name="email" placeholder="Email" onChange={handleChange} className="intro-x login__input form-control py-3 px-4 block mt-4" />
//                                     <input type="password" name="password" placeholder="Password" onChange={handleChange} className="intro-x login__input form-control py-3 px-4 block mt-4" />
//                                     <div className="intro-x w-full grid grid-cols-12 gap-4 h-1 mt-3">
//                                         {Array.from({ length: 4 }, (_, i) => (
//                                             <div key={i} className={`col-span-3 h-full rounded ${i < passwordStrength ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                                         ))}
//                                 </div>
//                                 <div className="intro-x mt-2 text-xs sm:text-sm">
//                                     {passwordStrengthText}
//                                 </div>
//                                 <a href="/" class="intro-x text-slate-500 block mt-2 text-xs sm:text-sm">What is a secure password?</a> 
//                                 <input type="text" class="intro-x login__input form-control py-3 px-4 block mt-4" placeholder="Password Confirmation"/>
//                             </div>
//                             <div class="intro-x flex items-center text-slate-600 dark:text-slate-500 mt-4 text-xs sm:text-sm">
//                                 <input id="remember-me" type="checkbox" class="form-check-input border mr-2"/>
//                                 <label class="cursor-pointer select-none" for="remember-me">I agree to the Envato</label>
//                                 <a class="text-primary dark:text-slate-200 ml-1" href="/">Privacy Policy</a>. 
//                             </div>
//                             <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
//                                 <button class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">Register</button>
//                                 <button class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">Sign in</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
            
//         </div>
        
//     );
// };

// export default UserSignup;