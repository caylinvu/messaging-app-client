import { Outlet, useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProfilePopup from '../components/ProfilePopup';
import Loading from '../components/Loading';
import FetchError from '../components/FetchError';
import {
  updateOnlineStatus,
  receiveConversation,
  receiveMessagePrev,
} from '../helpers/socketHelpers';
import { getContacts, getChats } from '../helpers/fetchHelpers';

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

  // If user is logged in, fetch contact/chat data
  useEffect(() => {
    if (user) {
      getContacts(user, setContacts, setContactError, setContactLoading);
      getChats(user, setChats, setChatError, setChatLoading);
      console.log('fetched data');
    }
  }, [user]);

  // Refetch data if connection is lost and reconnected
  useEffect(() => {
    socket.on('refetchData', () => {
      if (user) {
        getContacts(user, setContacts, setContactError, setContactLoading);
        getChats(user, setChats, setChatError, setChatLoading);
        console.log('refetched data');
      }
    });
    return () => {
      socket.off('refetchData');
    };
  }, [socket, user]);

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
