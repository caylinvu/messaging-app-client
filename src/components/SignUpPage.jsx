import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function SignUpPage() {
  // Need firstName, lastName, email, password, timestamp
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpError, setSignUpError] = useState(null);
  const { setUser } = useOutletContext();

  return (
    <div className="sign-up-page">
      <h1>Create a new account</h1>
      <form action="" className="sign-up-form">
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
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
          />
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
        {signUpError ? <p>{signUpError}</p> : null}
        <button type="submit">Login</button>
      </form>
      <p>
        Already have an account? <a href="/login">Please login here</a>
      </p>
    </div>
  );
}

export default SignUpPage;
