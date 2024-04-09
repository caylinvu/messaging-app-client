import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiLink } from '../apiLink';

function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [errors, setErrors] = useState([]);
  const { setUser } = useOutletContext();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiLink + '/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          passwordConf: passwordConf,
          timestamp: new Date().toISOString(),
        }),
      });
      const responseData = await response.json();
      if (response.status === 200) {
        setErrors([]);
        setUser(responseData.user);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        localStorage.setItem('user', JSON.stringify(responseData.user));
      } else if (!response.ok) {
        setErrors(responseData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sign-up-page">
      <h1>Create a new account</h1>
      <div className="sign-up-div">
        <form action="" onSubmit={handleSignUp} className="sign-up-form" autoComplete="off">
          <div className="form-group">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First name"
              maxLength={25}
            />
            {errors.map((error) => {
              if (error.path === 'firstName') {
                return <span key={error.path}>*{error.msg}</span>;
              }
            })}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last name"
              maxLength={25}
            />
            {errors.map((error) => {
              if (error.path === 'lastName') {
                return <span key={error.path}>*{error.msg}</span>;
              }
            })}
          </div>
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
            {errors.map((error) => {
              if (error.path === 'email') {
                return <span key={error.path}>*{error.msg}</span>;
              }
            })}
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
            {errors.map((error) => {
              if (error.path === 'password') {
                return <span key={error.path}>*{error.msg}</span>;
              }
            })}
          </div>
          <div className="form-group">
            <label htmlFor="passwordConf">Password confirmation</label>
            <input
              type="password"
              name="passwordConf"
              id="passwordConf"
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
              required
              placeholder="Password confirmation"
            />
            {errors.map((error) => {
              if (error.path === 'passwordConf') {
                return <span key={error.path}>*{error.msg}</span>;
              }
            })}
          </div>
          <button type="submit">Sign up</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
