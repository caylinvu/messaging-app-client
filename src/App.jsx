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
      // console.log('User connected');
      // console.log(socket);
    }
  }, [socket, user]);

  const handleLogout = () => {
    localStorage.clear();
    setUser('');
    socket.disconnect();
    console.log('User disconnected');
  };

  return (
    <>
      <Outlet context={{ user, setUser, handleLogout, socket }} />
    </>
  );
}

export default App;

// TO DO NEXT:

// Create group chat

// Group chat max??

// ALL TO DO:

// Maybe need to get rid of userDetails and just pull from contacts every time???

// Profile pop up to edit info from

// Chat info tab

// Delete chats

// Add ability to send images in chat

// Edit where login error messages are shown

// Do we want to keep logout after 24 hours????

// Add ability to fetch images from backend

// Send images

// Show preview time instead of date if in last 24 hours

// Set validation on form inputs
//-- Add body & validationResult on backend to make sure no username is used twice
//-- Make sure backend errors are displayed correctly on frontend
//-- Make sure backend errors are display in correct spot
//-- Also add frontend validation where needed
//-- Maybe add password confirmation????

// Create loading screen

// Create error page
//-- either have all paths navigate back to '/chats' or have an error page

// Instead of doing a conditional statement on returned HTML, use state and useEffect to store the variable on render and then display dynamically

// If chat is open when receiving new message, make notification bubble not pop up

// Add notification on chats button for new messages so u can see if new message is received while on the contact page

// Figure out how to refresh page if it was left open while computer went to sleep

// Add search bar for contacts/new chat popup???

// REFACTOR TO DO:

// Make more helper files (fetching, socket, etc)

// Figure out what to do about user vs userDetails

// Use socket.connected or update userDetails for current user's online status???
//-- Figure out if there is a way to make socket event happen AFTER chats and contacts are fetched

// Can I manipulate current contacts to update local user's online status while mapping over the contacts??

// STYLING TO DO:

// Style login page

// Style sign up page

// Style chat page

// Style contact page

// Style new chat popup

// Style edit profile popup

// Style chat info tab

// Pick a new font

// Refine color palette

// Add button hover style

// Add icons for certain buttons

// Style scroll bar
