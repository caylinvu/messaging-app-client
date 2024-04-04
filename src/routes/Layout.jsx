import { Outlet, useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import ProfilePopup from '../components/ProfilePopup';
import { sortChats } from '../helpers/chatHelpers';
import Loading from '../components/Loading';
import FetchError from '../components/FetchError';
import {
  updateOnlineStatus,
  receiveConversation,
  receiveMessagePrev,
} from '../helpers/socketHelpers';

function Layout() {
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userHash, setUserHash] = useState(Math.random().toString(36));
  const [groupHash, setGroupHash] = useState(Math.random().toString(36));
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState(null);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState(null);
  const { user, socket } = useOutletContext();
  const navigate = useNavigate();

  // Locally update incoming online status of other users
  useEffect(() => {
    socket.on('onlineStatus', (currentUser) => {
      updateOnlineStatus(contacts, currentUser, setContacts);
    });

    return () => {
      socket.off('onlineStatus');
    };
  }, [contacts, socket]);

  // Receive incoming conversations
  useEffect(() => {
    socket.on('receiveConversation', (data) => {
      receiveConversation(data, chats, setChats, contacts, setContacts, user, userDetails);

      // If current user created chat, navigate to new chat page
      if (data.sender === user._id) {
        navigate('/chats/' + data.conversation._id);
      }
    });

    return () => {
      socket.off('receiveConversation');
    };
  }, [chats, contacts, navigate, socket, user, userDetails]);

  // Receive incoming message previews
  useEffect(() => {
    socket.on('receiveMessagePrev', (message) => {
      receiveMessagePrev(message, chats, setChats);
    });

    return () => {
      socket.off('receiveMessagePrev');
    };
  }, [chats, socket]);

  // Fetch contacts
  const getContacts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (!response.ok) {
        if (response.status === 403) {
          throw { message: response.statusText, status: response.status };
        }
        const error = await response.json();
        throw { message: error.message || response.statusText, status: response.status };
      }
      const contactData = await response.json();
      setContacts(contactData);
      setContactError(null);
    } catch (err) {
      setContacts([]);
      setContactError(err);
    } finally {
      setContactLoading(false);
    }
  }, [user]);

  // Fetch current user's chats
  const getChats = useCallback(async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/users/' + user._id + '/conversations',
        {
          headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
        },
      );
      if (!response.ok) {
        if (response.status === 403) {
          throw { message: response.statusText, status: response.status };
        }
        const error = await response.json();
        throw { message: error.message || response.statusText, status: response.status };
      }
      const chatData = await response.json();
      const sortedChats = sortChats(chatData);
      setChats(sortedChats);
      setChatError(null);
    } catch (err) {
      setChats([]);
      setChatError(err);
      console.log(err);
    } finally {
      setChatLoading(false);
    }
  }, [user]);

  // If user is logged in, fetch contact/chat data
  useEffect(() => {
    if (user) {
      getContacts();
      getChats();
    }
  }, [user, getContacts, getChats]);

  // Set userDetails to use throughout components
  useEffect(() => {
    if (contacts.length > 0) {
      const currentUser = contacts.find((obj) => obj._id === user._id);
      setUserDetails(currentUser);
    }
  }, [contacts, user]);

  return (
    <div className="main-app">
      {contactLoading || chatLoading ? (
        <Loading />
      ) : contactError || chatError ? (
        <FetchError error={contactError || chatError} />
      ) : (
        <>
          <Sidebar
            userDetails={userDetails}
            socket={socket}
            setShowProfilePopup={setShowProfilePopup}
            userHash={userHash}
            chats={chats}
          />
          <Outlet
            context={{
              contacts,
              setContacts,
              chats,
              setChats,
              userDetails,
              user,
              socket,
              userHash,
              groupHash,
              setGroupHash,
            }}
          />
          {showProfilePopup && (
            <ProfilePopup
              setShowProfilePopup={setShowProfilePopup}
              contacts={contacts}
              setContacts={setContacts}
              user={user}
              userHash={userHash}
              setUserHash={setUserHash}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Layout;
