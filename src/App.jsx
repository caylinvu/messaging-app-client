import './styles/App.css';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { apiLink } from './apiLink';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || '');

  // Socket setup
  const socket = io(apiLink, {
    autoConnect: false,
    auth: {
      token: user.token,
      user: user._id,
    },
  });

  // Connect to socket if user is logged in
  useEffect(() => {
    if (user) {
      socket.connect();
    }
  }, [socket, user]);

  // Handle logging out
  const handleLogout = () => {
    localStorage.clear();
    setUser('');
    socket.disconnect();
  };

  return (
    <>
      <Outlet context={{ user, setUser, handleLogout, socket }} />
    </>
  );
}

export default App;

// ~~~~~~~~~~ REFACTOR TO DO ~~~~~~~~~~

// Add better comments throughout all files!!!

// Put all HTTP requests in fetchHelpers

// Figure out what to do about user vs userDetails

// Maybe need to get rid of userDetails and just pull from contacts every time???

// Use socket.connected or update userDetails for current user's online status???
//-- Figure out if there is a way to make socket event happen AFTER chats and contacts are fetched

// Can I manipulate current contacts to update local user's online status while mapping over the contacts??

// Clean up class names???

// Instead of doing a conditional statement on returned HTML, utilize useState and useEffect
// to store the variable on render and then display dynamically

// Is there a better way to implement opening messages?

// Clean up css

// ~~~~~~~~~~ CAN ADD LATER BUT UNNECESSARY FOR NOW ~~~~~~~~~~

// Add way to upload group image on creation

// If scrolled to top and get new message, show new message notification and jump to bottom button??

// Add search bar for contacts/new chat popup

// Send profile/group profile changes through socket so they are automatically displayed

// Look into validating form data through socket (new group & sending message)

// Also validate image uploads on frontend/backend (message images)

// Add better error handling (images/other http requests besides fetching data)

// Add better validation styling

// Add drafts to keep unsent text when switching between chats

// Maybe update to get all messages from current user on login so that we don't have to fetch
//--every time a message is clicked on

// Figure out JWT verification on socket requests

// Make message input increase rows as you type longer messages

// Add number of unread messages in notification bubble

// When clicking on contacts after having a chat open, make chat button return to previous chat

// When in tablet/mobile view and click on chat, have the chat list scroll to the top afterwards

// New message causes chat list to scroll to top

// Update so if you refresh on message page, it only shows one loader

// Receiving messages
//--Locally add to end of array instead of sorting for performance
//--Maybe don't emit message to self and update locally on send instead

// Add loading screen for login

// Mutli image send issue????

// Sync multiple browsers for same user???

// Fix white line at bottom of message container sometimes?? only when images are displayed

// Add delete messages for admin use
