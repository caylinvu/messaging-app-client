import './styles/App.css';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || '');

  return (
    <>
      <Outlet context={{ user, setUser }} />
    </>
  );
}

export default App;

// Set up authorization to login and get current user info

// Set up authorization to login
//-- login page form
//-- localstorage to save token, current user, token, and login status
//-- sign up form (automatically logs you in)

// Edit where login error messages are shown

// Use returned login info to connect to socket

// Use returned login info to fetch data
//-- If logged in, need to fetch all user data and all chats that include the current user
//-- When clicking on an individual chat, fetch messages from that chat

// Create loading screen

// Create error page
//-- either have all paths navigate back to '/chats' or have an error page
