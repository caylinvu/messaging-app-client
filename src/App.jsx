import './styles/App.css';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || '');

  const handleLogout = () => {
    localStorage.clear();
    setUser('');
  };

  // Log user out if token is older than 24 hours
  useEffect(() => {
    if (localStorage.getItem('user')) {
      const hours = 24;
      const createdAt = JSON.parse(localStorage.getItem('createdAt'));
      if (new Date().getTime() - createdAt > hours * 60 * 60 * 1000) {
        handleLogout();
        return;
      }
    }
  }, []);

  return (
    <>
      <Outlet context={{ user, setUser, handleLogout }} />
    </>
  );
}

export default App;

// TO DO NEXT:

// Use returned login info to connect to socket

// Implement sending a new message through chat

// ALL TO DO:

// Set up authorization to login
//-- login page form
//-- localstorage to save token, current user, token, and login status
//-- sign up form (automatically logs you in)

// Sign up page

// Contact page

// New chat

// New chat from contact page

// Profile info pop up

// Chat info pop up

// Edit where login error messages are shown

// Do we want to keep logout after 24 hours????

// Add ability to fetch images from backend

// Show preview time instead of date if in last 24 hours

// If user's last read time for a conversation is less than the conversations last message timestamp, show notification
//-- UPDATE LAST READ TIME WHEN OPEN

// Use returned login info to fetch data
//-- If logged in, need to fetch all user data and all chats that include the current user
//-- When clicking on an individual chat, fetch messages from that chat

// Create loading screen

// Create error page
//-- either have all paths navigate back to '/chats' or have an error page

// Add date bar in messages!!

// figure out why eslint isn't working???

// Deal with chat notifications if you already have page open when you refresh or get new message

// Instead of doing a conditional statement on returned HTML, use state and useEffect to store the variable on render and then display dynamically
