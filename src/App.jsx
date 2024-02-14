import './styles/App.css';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || '');

  const socket = io('http://localhost:3000', {
    autoConnect: false,
    auth: {
      token: user.token,
      user: user._id,
    },
  });

  useEffect(() => {
    if (user) {
      socket.connect();
      console.log('User connected');
      console.log(socket);
    }
  }, [socket, user]);

  const handleLogout = () => {
    localStorage.clear();
    setUser('');
    socket.disconnect();
    console.log('User disconnected');
  };

  // Log user out if token is older than 24 hours
  // useEffect(() => {
  //   if (localStorage.getItem('user')) {
  //     const hours = 24;
  //     const createdAt = JSON.parse(localStorage.getItem('createdAt'));
  //     if (new Date().getTime() - createdAt > hours * 60 * 60 * 1000) {
  //       handleLogout();
  //       return;
  //     }
  //   }
  // }, []);

  return (
    <>
      <Outlet context={{ user, setUser, handleLogout, socket }} />
    </>
  );
}

export default App;

// TO DO NEXT:

// Sign up page

// Condense handle login into one function (with demo user creds passed through)

// Auto-login when creating account

// ALL TO DO:

// Maybe change so that you fetch contacts every time you click on the contact page????

// Create group chat

// Profile pop up to edit info from

// Chat info tab

// Delete chats

// Edit where login error messages are shown

// Do we want to keep logout after 24 hours????

// Add ability to fetch images from backend

// Send images

// Show preview time instead of date if in last 24 hours

// Set validation on form inputs

// Create loading screen

// Create error page
//-- either have all paths navigate back to '/chats' or have an error page

// Instead of doing a conditional statement on returned HTML, use state and useEffect to store the variable on render and then display dynamically

// If chat is open when receiving new message, make notification bubble not pop up

// REFACTOR TO DO:

// Make a sort chat function to use in multiple places

// Move socket.on('createConversation) from ChatPop component to ChatPage component

// STYLING TO DO:

// Pick a new font

// Refine color palette

// Add button hover style

// Add icons for certain buttons

// Style scroll bar
