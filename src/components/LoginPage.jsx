import { useState } from 'react';
import PropTypes from 'prop-types';

function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  return (
    <div className="login-page">
      <h1>Login to your account</h1>
    </div>
  );
}

export default LoginPage;

LoginPage.propTypes = {
  setUser: PropTypes.func,
};
