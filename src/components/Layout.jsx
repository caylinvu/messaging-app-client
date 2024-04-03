import { Outlet, useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import ProfilePopup from './ProfilePopup';
import { sortChats } from '../helpers/chatHelpers';
import Loading from './Loading';
import FetchError from './FetchError';

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

  useEffect(() => {
    socket.on('onlineStatus', (currentUser) => {
      const existingContact = contacts.find((obj) => obj._id === currentUser._id);
      if (existingContact) {
        const updatedContacts = contacts.map((contact) => {
          if (contact._id === currentUser._id) {
            return {
              ...contact,
              isOnline: currentUser.isOnline,
            };
          } else {
            return contact;
          }
        });
        setContacts(updatedContacts);
      } else if (!existingContact) {
        const newContacts = [...contacts, currentUser];
        const sortedContacts = newContacts.sort((a, b) => {
          let textA = a.firstName.toLowerCase();
          let textB = b.firstName.toLowerCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        setContacts(sortedContacts);
      }
    });

    return () => {
      socket.off('onlineStatus');
    };
  }, [contacts, socket]);

  useEffect(() => {
    socket.on('receiveConversation', (data) => {
      const newChats = [...chats, data.conversation];
      const sortedChats = sortChats(newChats);
      setChats(sortedChats);

      // Update new conversation under user also!!!!
      const updatedConvs = [
        ...userDetails.convData,
        {
          conv: data.conversation._id,
        },
      ];
      const updatedUsers = contacts.map((obj) => {
        if (obj._id === user._id) {
          return {
            ...obj,
            convData: updatedConvs,
          };
        } else {
          return obj;
        }
      });
      // console.log('Received conversation');
      setContacts(updatedUsers);

      // If user created chat, navigate to new chat page
      if (data.sender === user._id) {
        navigate('/chats/' + data.conversation._id);
      }
    });

    return () => {
      socket.off('receiveConversation');
    };
  }, [chats, contacts, navigate, socket, user, userDetails]);

  // Receiving message
  useEffect(() => {
    socket.on('receiveMessagePrev', (message) => {
      const newChats = chats.map((chat) => {
        if (message.conversation.toString() === chat._id) {
          return {
            ...chat,
            lastMessage: message,
            exclude: [],
          };
        } else {
          return chat;
        }
      });
      const sortedChats = sortChats(newChats);
      setChats(sortedChats);
    });

    return () => {
      socket.off('receiveMessagePrev');
    };
  }, [chats, socket]);

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
          console.log('forbidden');
          throw { message: response.statusText, status: response.status };
        }
        console.log('response is not okay');
        const error = await response.json();
        console.log(error);
        throw { message: error.message || response.statusText, status: response.status };
      }
      const contactData = await response.json();
      // console.log('Contacts fetched');
      setContacts(contactData);
      setContactError(null);
      // console.log(contactData);
    } catch (err) {
      console.log('Contacts failed to fetch');
      setContacts([]);
      setContactError(err);
      console.log(err);
    } finally {
      setContactLoading(false);
    }
  }, [user]);

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
          console.log('forbidden');
          throw { message: response.statusText, status: response.status };
        }
        const error = await response.json();
        throw { message: error.message || response.statusText, status: response.status };
        // throw new Error(`This is an HTTP error: The status is ${response.status}`);
      }
      const chatData = await response.json();
      const sortedChats = sortChats(chatData);
      // console.log('Chats fetched');
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

  useEffect(() => {
    if (user) {
      getContacts();
      getChats();
    }
  }, [user, getContacts, getChats]);

  useEffect(() => {
    if (contacts.length > 0) {
      const currentUser = contacts.find((obj) => obj._id === user._id);
      // console.log(socket.connected);
      // currentUser.isOnline = socket.connected;
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
