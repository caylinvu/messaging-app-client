import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const { setUser } = useOutletContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (response.status === 200) {
        setLoginError(null);
        setUser(responseData.user);
        setEmail('');
        setPassword('');
        localStorage.setItem('user', JSON.stringify(responseData.user));
        localStorage.setItem('createdAt', new Date().getTime());
      } else if (!response.ok) {
        setLoginError(responseData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'jon@gmail.com',
          password: 'JonSnow3',
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (response.status === 200) {
        setLoginError(null);
        setUser(responseData.user);
        setEmail('');
        setPassword('');
        localStorage.setItem('user', JSON.stringify(responseData.user));
        localStorage.setItem('createdAt', new Date().getTime());
      } else if (!response.ok) {
        setLoginError(responseData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div onSubmit={handleLogin} className="login-page">
      <h1>Login to your account</h1>
      <form action="" className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        {loginError ? <p>{loginError}</p> : null}
        <button type="submit">Login</button>
        <button type="button" onClick={demoLogin}>
          Demo user (Jon Snow)
        </button>
      </form>
      <p>
        New to Cherry Chat? <a href="/sign-up">Create an account</a>
      </p>
    </div>
  );
}

export default LoginPage;
