import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import ChatPopup from '../components/ChatPopup';
import ChatList from '../components/ChatList';
import PropTypes from 'prop-types';
import { updateLastRead } from '../helpers/fetchHelpers';

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
    triggerFetch,
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

  // Handle opening new chat notications
  useEffect(() => {
    if (chatId && chats) {
      const thisChat = chats.find((obj) => obj._id === chatId);
      if (thisChat) {
        const thisUser = contacts.find((obj) => obj._id === user._id);
        const userConv = thisUser.convData.find((obj) => obj.conv.toString() === chatId);
        // If a new message is being opened, update the user's last read time for the chat
        if (
          (thisChat.lastMessage && !userConv.lastRead) ||
          (thisChat.lastMessage && userConv.lastRead < thisChat.lastMessage.timestamp)
        ) {
          updateLastRead(user, thisUser, thisChat, updateLocalUser);
        }
      }
    }
  }, [chatId, chats, contacts, user, updateLocalUser]);

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
          triggerFetch,
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
