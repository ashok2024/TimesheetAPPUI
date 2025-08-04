import React from 'react';
import LoginForm from '../layouts/authentication/sign-in/index';

const LoginPage = () => {
  return (
    <div className="login-container">
      <h2>Login to Timesheet Tracker</h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
