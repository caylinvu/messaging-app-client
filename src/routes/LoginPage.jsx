import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const { setUser } = useOutletContext();

  const handleLogin = async (e, userEmail, userPassword) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userEmail,
          password: userPassword,
        }),
      });
      const responseData = await response.json();
      if (response.status === 200) {
        setLoginError(null);
        setUser(responseData.user);
        setEmail('');
        setPassword('');
        localStorage.setItem('user', JSON.stringify(responseData.user));
      } else if (!response.ok) {
        setLoginError(responseData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-page">
      <h1>Login to your account</h1>
      <div className="login-div">
        <form
          action=""
          onSubmit={(e) => handleLogin(e, email, password)}
          className="login-form"
          autoComplete="off"
        >
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          {loginError ? <p className="login-error">*{loginError}</p> : null}
          <button type="submit">Login</button>
        </form>
        <button type="button" onClick={(e) => handleLogin(e, 'jon@gmail.com', 'JonSnow3')}>
          Demo user
        </button>
        <p>
          New to Cherry Chat? <a href="/sign-up">Create an account</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
