import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
}


const UserSignup: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const { first_name, last_name, email, password } = formData;
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
    return (
        <>
            <div
                className={clsx([
                    "-m-3 sm:-mx-8 p-3 sm:px-8 relative lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
                    "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
                    "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
                ])}
            >
                <DarkModeSwitcher />
                <div className="container relative z-10 sm:px-10">
                    <div className="block grid-cols-2 gap-4 xl:grid">
                        {/* BEGIN: Register Info */}
                        <div className="flex-col hidden min-h-screen xl:flex">
                            <a
                                href=""
                                className="flex items-center pt-5 -intro-x"
                            >
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="w-6"
                                    src={logoUrl}
                                />
                                <span className="ml-3 text-lg text-white"> Rubick </span>
                            </a>
                            <div className="my-auto">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="w-1/2 -mt-16 -intro-x"
                                    src={illustrationUrl}
                                />
                                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                                    A few more clicks to <br />
                                    sign up to your account.
                                </div>
                                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">Manage all your Youtube Uploads in one place</div>
                            </div>
                        </div>
                        {/* END: Register Info */}
                        {/* BEGIN: Register Form */}
                        <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                            <form onSubmit={handleSubmit} className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Sign Up</h2>
                                <div className="mt-8 intro-x">
                                    <FormInput
                                        type="text"
                                        className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
                                        placeholder="First Name"
                                        name="first_name"
                                        onChange={handleChange}
                                    />
                                    <FormInput
                                        type="text"
                                        className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                                        placeholder="Last Name"
                                        name="last_name"
                                        onChange={handleChange}
                                    />
                                    <FormInput
                                        type="email"
                                        className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                                        placeholder="Email"
                                        name="email"
                                        onChange={handleChange}
                                    />
                                    <FormInput
                                        type="password"
                                        className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                                        placeholder="Password"
                                        name="password"
                                        onChange={handleChange}
                                    />
                                    {/* Password strength indicator */}
                                    {/* Password strength indicator */}
                                    <div className="grid w-full h-1 grid-cols-4 gap-4 mt-3 intro-x">
                                        {Array.from({ length: 4 }, (_, i) => (
                                            <div
                                                key={i}
                                                className={`h-full rounded ${i < passwordStrength ? 'bg-success' : 'bg-slate-100 dark:bg-darkmode-800'}`}
                                            ></div>
                                        ))}
                                    </div>



                                    {/* ... (Password strength indicators, etc.) */}
                                    <FormInput
                                        type="password"
                                        className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex items-center mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                                    <FormCheck.Input
                                        id="remember-me"
                                        type="checkbox"
                                        className="mr-2 border"
                                    />
                                    By signin up, you agree to our{" "}
                                    <a className="text-primary dark:text-slate-200" href="">
                                        Terms and Conditions
                                    </a>{" "}
                                    &{" "}
                                    <a className="text-primary dark:text-slate-200" href="">
                                        Privacy Policy.
                                    </a>
                                </div>
                                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                                    <Button
                                        variant="primary"
                                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                                        type="submit"
                                    >
                                        Register
                                    </Button>
                                    {/* ... (Other buttons, etc.) */}
                                    <Button
                                        variant="outline-secondary"
                                        className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                                        onClick={() => navigate('/login')}
                                    >
                                        Sign in
                                    </Button>
                                </div>
                            </form>
                        </div>
                        {/* END: Register Form */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserSignup;
