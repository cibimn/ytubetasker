import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';
import { Menu, Dialog } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";

interface FormData {
    email: string;
    password: string;
}

const Main: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = formData;
        try {
            await axios.post('http://localhost:8000/api/users/user_login/', { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            setSuccessModalOpen(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data.message || 'An error occurred while logging in');
                setErrorModalOpen(true);
            } else {
                setErrorMessage('An unexpected error occurred');
                setErrorModalOpen(true);
            }

            console.error('There was an error!', error);
        }

    };
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
                        {/* BEGIN: Login Info */}
                        <div className="flex-col hidden min-h-screen xl:flex">
                            <a href="" className="flex items-center pt-5 -intro-x">
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
                                    sign in to your account.
                                </div>
                                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                                    Manage all your e-commerce accounts in one place
                                </div>
                            </div>
                        </div>
                        {/* END: Login Info */}
                        {/* BEGIN: Login Form */}
                        <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">

                            <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                                A few more clicks to sign in to your account. Manage all your
                                e-commerce accounts in one place
                            </div>
                            <form onSubmit={handleSubmit} className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                                    Sign In
                                </h2>
                                <div className="mt-8 intro-x">
                                    <FormInput
                                        type="text"
                                        className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
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
                                </div>
                                <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                                    <div className="flex items-center mr-auto">
                                        <FormCheck.Input
                                            id="remember-me"
                                            type="checkbox"
                                            className="mr-2 border"
                                        />
                                        <label
                                            className="cursor-pointer select-none"
                                            htmlFor="remember-me"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="">Forgot Password?</a>
                                </div>
                                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                                    <Button
                                        variant="primary"
                                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                                    {/* ... (Other buttons, etc.) */}
                                    <Button
                                        variant="outline-secondary"
                                        className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                                        onClick={() => navigate('/register')}
                                    >
                                        Register
                                    </Button>
                                </div>
                                <br />
                                <label
                                    className="cursor-pointer select-none"
                                    htmlFor="remember-me"
                                >
                                    I agree to the YtubeTasker
                                </label>
                                <a className="ml-1 text-primary dark:text-slate-200" href="">
                                    Privacy Policy
                                </a>

                            </form>
                            <Dialog
                                open={successModalOpen}
                                onClose={() => {
                                    setSuccessModalOpen(false);
                                    navigate('/');  // Navigate to home or dashboard
                                }}
                            >
                                <Dialog.Panel>
                                    <div className="p-5 text-center">
                                        <Lucide icon="CheckCircle" className="w-16 h-16 mx-auto mt-3 text-success" />
                                        <div className="mt-5 text-3xl">Logged In Successfully!</div>
                                    </div>
                                    <div className="px-5 pb-8 text-center">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => {
                                                setSuccessModalOpen(false);
                                                navigate('/');
                                            }}
                                            className="w-24"
                                        >
                                            Ok
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Dialog>

                            {/* Error Modal */}
                            <Dialog
                                open={errorModalOpen}
                                onClose={() => {
                                    setErrorModalOpen(false);
                                }}
                            >
                                <Dialog.Panel>
                                    <div className="p-5 text-center">
                                        <Lucide icon="XCircle" className="w-16 h-16 mx-auto mt-3 text-danger" />
                                        <div className="mt-5 text-3xl">Error</div>
                                        <div className="mt-2 text-slate-500">{errorMessage}</div>
                                    </div>
                                    <div className="px-5 pb-8 text-center">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => {
                                                setErrorModalOpen(false);
                                            }}
                                            className="w-24"
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Dialog>
                        </div>
                        {/* END: Login Form */}
                    </div>
                </div>

            </div>


        </>

    );
}

export default Main;
