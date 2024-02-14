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

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          timestamp: new Date().toISOString(),
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (response.status === 200) {
        setSignUpError(null);
        setUser(responseData.user);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        localStorage.setItem('user', JSON.stringify(responseData.user));
        // localStorage.setItem('createdAt', new Date().getTime());
      } else if (!response.ok) {
        console.log(responseData.message);
        setSignUpError(responseData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sign-up-page">
      <h1>Create a new account</h1>
      <form action="" onSubmit={handleSignUp} className="sign-up-form">
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
        <button type="submit">Sign up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Please login here</a>
      </p>
    </div>
  );
}

export default SignUpPage;
