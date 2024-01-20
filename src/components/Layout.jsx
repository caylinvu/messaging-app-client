import { Outlet, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

function Layout() {
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const { user } = useOutletContext();

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
        console.log(contactData);
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
        setChats(chatData);
        console.log(chatData);
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
      <Outlet context={{ contacts, chats }} />
    </div>
  );
}

export default Layout;
