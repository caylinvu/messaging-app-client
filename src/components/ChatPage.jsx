import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatPopup from './ChatPopup';
import ChatList from './ChatList';

function ChatPage() {
  const [showChatPopup, setShowChatPopup] = useState(false);
  // const [showChatList, setShowChatList] = useState(true);
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
    minimizeList,
    showMobileList,
    expandList,
  } = useOutletContext();
  const { chatId } = useParams();

  // Update chat's lastRead time for current user in the database
  const updateDbUser = async (chat, thisUser) => {
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
  };

  // Update chat's lastRead time for current user locally
  const updateLocalUser = (chat, thisUser) => {
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
    console.log('Updated local user lastRead');
    setContacts(updatedUsers);
  };

  // Update database when new message is opened
  const openNewMsg = (chat, thisUser, userConv) => {
    // console.log('newmsg ' + userConv);
    if (
      (chat.lastMessage && !userConv.lastRead) ||
      (chat.lastMessage && userConv.lastRead < chat.lastMessage.timestamp)
    ) {
      updateDbUser(chat, thisUser);
    }
  };

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
  }, [chatId, chats, contacts, user]);

  useEffect(() => {
    const resizeWindow = () => {
      if (chatId) {
        console.log(chatId);
        minimizeList();
      }
    };

    window.addEventListener('resize', resizeWindow);

    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  });

  return (
    <div className="chat-page">
      <div className={showMobileList ? 'chat-column show' : 'chat-column'}>
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
            minimizeList={minimizeList}
          />
        ) : (
          <div>You currently have no chats open. Choose a contact to get started!</div>
        )}
      </div>
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
          showMobileList,
          minimizeList,
          expandList,
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
          minimizeList={minimizeList}
        />
      )}
    </div>
  );
}

export default ChatPage;
