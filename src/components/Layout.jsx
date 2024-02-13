import { Outlet, useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

function Layout() {
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const { user, socket } = useOutletContext();
  const navigate = useNavigate();

  socket.on('onlineStatus', (currentUser) => {
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
  });

  useEffect(() => {
    socket.on('receiveConversation', (data) => {
      const newChats = [...chats, data.conversation];
      const sortedChats = newChats.sort((x, y) => {
        if (x.lastMessage && y.lastMessage) {
          return new Date(y.lastMessage.timestamp) - new Date(x.lastMessage.timestamp);
        } else if (x.lastMessage && !y.lastMessage) {
          return new Date(y.timestamp) - new Date(x.lastMessage.timestamp);
        } else if (!x.lastMessage && y.lastMessage) {
          return new Date(y.lastMessage.timestamp) - new Date(x.timestamp);
        } else if (!x.lastMessage && !y.lastMessage) {
          return new Date(y.timestamp) - new Date(x.timestamp);
        }
      });
      // console.log(sortedChats);
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
      console.log(updatedConvs);
      console.log(updatedUsers);
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

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }
        const contactData = await response.json();
        setContacts(contactData);
        // console.log(contactData);
      } catch (err) {
        setContacts([]);
        console.log(err);
      }
    };
    if (user) {
      getContacts();
    }
  }, [user]);

  useEffect(() => {
    if (contacts.length > 0) {
      setUserDetails(contacts.find((obj) => obj._id === user._id));
    }
  }, [contacts, user]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/users/' + user._id + '/conversations',
          {
            headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
          },
        );
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }
        const chatData = await response.json();
        // Sort by conversation's last message timestamp, or if no last message
        // then sort by conversation's creation timestamp
        const sortedChats = chatData.sort((x, y) => {
          if (x.lastMessage && y.lastMessage) {
            return new Date(y.lastMessage.timestamp) - new Date(x.lastMessage.timestamp);
          } else if (x.lastMessage && !y.lastMessage) {
            return new Date(y.timestamp) - new Date(x.lastMessage.timestamp);
          } else if (!x.lastMessage && y.lastMessage) {
            return new Date(y.lastMessage.timestamp) - new Date(x.timestamp);
          } else if (!x.lastMessage && !y.lastMessage) {
            return new Date(y.timestamp) - new Date(x.timestamp);
          }
        });
        setChats(sortedChats);
        // console.log(sortedChats);
      } catch (err) {
        setChats([]);
        console.log(err);
      }
    };
    if (user) {
      getChats();
    }
  }, [user]);

  return (
    <div className="main-app">
      <Sidebar userDetails={userDetails} />
      <Outlet context={{ contacts, setContacts, chats, setChats, userDetails, user, socket }} />
    </div>
  );
}

export default Layout;
