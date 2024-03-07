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

// ~~~~~~~~~~ TO DO NEXT ~~~~~~~~~~

// ~~~~~~~~~~ ALL TO DO ~~~~~~~~~~

// Create loading screen
//--Figure out how to make scroll bar not show up when switching between scrollable and non-scrollable chats
//--(maybe fixed after adding loading screen??)

// Create error page
//-- either have all paths navigate back to '/chats' or have an error page

// JWT
//--Make sure token is sent in all HTTP requests
//--Add verifyToken to routes on backend
//--Possibly add token verification on some socket requests?

// Socket/Computer going to sleep
//--Figure out how to refresh page if it was left open while computer went to sleep
//--Figure out how to disconnect from socket when computer goes to sleep??
//--How to make socket reconnect when waking computer up??

// Refine demo user

// ~~~~~~~~~~ REFACTOR TO DO ~~~~~~~~~~

// Add better comments throughout all files!!!

// Put socket creation in useEffect???

// Make more helper files (fetching, socket, etc)

// Figure out what to do about user vs userDetails

// Maybe need to get rid of userDetails and just pull from contacts every time???

// Use socket.connected or update userDetails for current user's online status???
//-- Figure out if there is a way to make socket event happen AFTER chats and contacts are fetched

// Can I manipulate current contacts to update local user's online status while mapping over the contacts??

// Make components or factory function or helper functions or SOMETHING for repeat code when display user info between group or other user

// Clean up class names???

// messages: get rid of msg-outer div

// Create routes folder

// Remove logout after 24 hour stuff

// Instead of doing a conditional statement on returned HTML, use state and useEffect to store the variable on render and then display dynamically

// Is there a better way to implement opening messages?

// Check all eslint warnings

// ~~~~~~~~~~ STYLING TO DO ~~~~~~~~~~

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

//---- Style image error to be a popup that goes away

// Add icons for certain buttons
//--Maybe add group icon for group messages without an image???

// Style scroll bar

// Add animations for popups

// ~~~~~~~~~~ CAN ADD LATER BUT UNNECESSARY FOR NOW ~~~~~~~~~~

// Add way to upload group image on creation

// Look into not scrolling when you receive a message and ur at top of chat

// Add search bar for contacts/new chat popup

// Send profile/group profile changes through socket so they are automatically displayed

// Look into validating form data through socket (new group & sending message)

// Add drafs to keep unsent text when switching between chats
