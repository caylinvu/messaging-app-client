import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import ChatPopup from '../components/ChatPopup';
import ChatList from '../components/ChatList';
import PropTypes from 'prop-types';

function ChatPage() {
  const [showChatPopup, setShowChatPopup] = useState(false);
  const {
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
  } = useOutletContext();
  const { chatId } = useParams();

  // Update chat's lastRead time for current user locally
  const updateLocalUser = useCallback(
    (chat, thisUser) => {
      const updatedConvs = thisUser.convData.map((obj) => {
        if (obj.conv.toString() === chat._id) {
          return {
            ...obj,
            lastRead: new Date().toISOString(),
          };
        } else {
          return obj;
        }
      });

      const updatedUsers = contacts.map((obj) => {
        if (obj._id === thisUser._id) {
          return {
            ...obj,
            convData: updatedConvs,
          };
        } else {
          return obj;
        }
      });
      setContacts(updatedUsers);
    },
    [contacts, setContacts],
  );

  // Update chat's lastRead time for current user in the database
  const updateDbUser = useCallback(
    async (chat, thisUser) => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/users/' + user._id + '/timestamp/' + chat._id,
          {
            method: 'PUT',
            headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
            }),
          },
        );
        if (response.status === 200) {
          updateLocalUser(chat, thisUser);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [updateLocalUser, user],
  );

  // Update database when new message is opened
  const openNewMsg = useCallback(
    (chat, thisUser, userConv) => {
      if (
        (chat.lastMessage && !userConv.lastRead) ||
        (chat.lastMessage && userConv.lastRead < chat.lastMessage.timestamp)
      ) {
        updateDbUser(chat, thisUser);
      }
    },
    [updateDbUser],
  );

  // Handle opening new chat notications
  useEffect(() => {
    if (chatId && chats) {
      const thisChat = chats.find((obj) => obj._id === chatId);
      if (thisChat) {
        const thisUser = contacts.find((obj) => obj._id === user._id);
        const userConv = thisUser.convData.find((obj) => obj.conv.toString() === chatId);
        openNewMsg(thisChat, thisUser, userConv);
      }
    }
  }, [chatId, chats, contacts, user, openNewMsg]);

  return (
    <div className="chat-page">
      <ChatColumn
        setShowChatPopup={setShowChatPopup}
        chats={chats}
        contacts={contacts}
        userDetails={userDetails}
        groupHash={groupHash}
        chatId={chatId}
      />
      <Outlet
        context={{
          contacts,
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
      {showChatPopup && (
        <ChatPopup
          setShowChatPopup={setShowChatPopup}
          contacts={contacts}
          chats={chats}
          setChats={setChats}
          user={user}
          socket={socket}
        />
      )}
    </div>
  );
}

function ChatColumn({ setShowChatPopup, chats, contacts, userDetails, groupHash, chatId }) {
  const chatRef = useRef(null);

  const scrollToTop = () => {
    chatRef.current.scrollIntoView();
  };

  useEffect(() => {
    if (chatRef.current && window.innerWidth <= 785) {
      scrollToTop();
    }
  }, [chatId]);

  return (
    <div className="chat-column">
      <div className="chat-ref" ref={chatRef}></div>
      <div className="chat-header">
        <h1>Chats</h1>
        <button onClick={() => setShowChatPopup(true)}>
          <img src="/add-simple.svg" alt="" />
        </button>
      </div>
      {chats.length > 0 ? (
        <ChatList
          chats={chats}
          contacts={contacts}
          userDetails={userDetails}
          groupHash={groupHash}
          chatId={chatId}
        />
      ) : (
        <div>You currently have no chats open. Choose a contact to get started!</div>
      )}
    </div>
  );
}

ChatColumn.propTypes = {
  setShowChatPopup: PropTypes.func,
  chats: PropTypes.array,
  contacts: PropTypes.array,
  userDetails: PropTypes.object,
  groupHash: PropTypes.string,
  chatId: PropTypes.string,
};

export default ChatPage;
