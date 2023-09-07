import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import UserSignup from './UserSingup';
import UserLogin from './UserLogin';
import Home from './HomePage';
import VerifyEmail from './VerifyEmail';
import PasswordReset from './PasswordReset';
import ConfirmPasswordReset from './ConfirmPasswordReset';
import UserLogout from './UserLogout';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<UserSignup />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/logout" element={<UserLogout />} />
        <Route path="/verify_email/:token" element={<VerifyEmail />} /> 
        <Route path="/password_reset" element={<PasswordReset />} />
        <Route path="/password_reset_confirm/:token" element={<ConfirmPasswordReset />} />
      </Routes>
    </Router>
  );
}

export default App;
