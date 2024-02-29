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

// ~~~~~~~~~~ TO DO NEXT ~~~~~~~~~~

// Images
//--Figure out how to make scroll bar not show up when switching between scrollable and non-scrollable chats
//--Style image error to be a popup that goes away
//--Look into not scrolling when you receive a message and ur at top of chat???

// ~~~~~~~~~~ ALL TO DO ~~~~~~~~~~

// messages: get rid of msg-outer div

// Add confirmation for deleting chat

// SIDEBAR FIRST NAME BUG (USERDETAILS)

// Add profile image to profile button

// Edit where login error messages are shown

// Contact page - show online users at top

// Profile updates
//--Maybe do new contact fetch when clicking on contacts???
//--Maybe do new chat fetch when clicking on chats????
//--Maybe make profile updates in real time through socket???

// Do we want to keep logout after 24 hours????

// Show preview time instead of date if in last 24 hours

// Exit all popups when clicking on blocker??

// Set validation on form inputs
//-- Add body & validationResult on backend to make sure no username is used twice
//-- Make sure backend errors are displayed correctly on frontend
//-- Make sure backend errors are display in correct spot
//-- Also add frontend validation where needed
//-- Maybe add password confirmation????
//-- Server side validation

// Create loading screen

// Create error page
//-- either have all paths navigate back to '/chats' or have an error page

// Instead of doing a conditional statement on returned HTML, use state and useEffect to store the variable on render and then display dynamically

// If chat is open when receiving new message, make notification bubble not pop up

// Add notification on chats button for new messages so u can see if new message is received while on the contact page

// Figure out how to refresh page if it was left open while computer went to sleep

// Add search bar for contacts/new chat popup???

// Group chat max????

// Figure out how to disconnect from socket when computer goes to sleep??

//Figure out how to make scroll bar not show up when switching between scrollable and non-scrollable chats
//--(maybe fixed after adding loading screen??)

// ~~~~~~~~~~ REFACTOR TO DO ~~~~~~~~~~

// Make more helper files (fetching, socket, etc)

// Figure out what to do about user vs userDetails

// Maybe need to get rid of userDetails and just pull from contacts every time???

// Use socket.connected or update userDetails for current user's online status???
//-- Figure out if there is a way to make socket event happen AFTER chats and contacts are fetched

// Can I manipulate current contacts to update local user's online status while mapping over the contacts??

// Make components or factory function or helper functions or SOMETHING for repeat code when display user info between group or other user

// Clean up class names???

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

// Add icons for certain buttons
//--Maybe add group icon for group messages without an image???

// Style scroll bar

// Add animations for popups

// ~~~~~~~~~~ CAN ADD LATER BUT UNNECESSARY FOR NOW ~~~~~~~~~~

// Add way to upload group image on creation
