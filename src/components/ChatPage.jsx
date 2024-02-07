import { Outlet, useOutletContext, Link, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import ChatPopup from './ChatPopup';

function ChatPage() {
  const [showChatPopup, setShowChatPopup] = useState(false);
  const { contacts, chats, setChats, userDetails, user, socket } = useOutletContext();
  const { chatId } = useParams();

  const updateDbUser = async (chat) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/conversations/' + chat._id + '/timestamp/' + user._id,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
          }),
        },
      );
      if (response.status === 200) {
        updateLocalUser(chat);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateLocalUser = (chat) => {
    const updatedChats = chats.map((obj) => {
      if (obj._id === chat._id) {
        return {
          ...obj,
          members: obj.members.map((member) => {
            if (member.member.toString() === userDetails._id) {
              return {
                ...member,
                lastRead: new Date().toISOString(),
              };
            } else {
              return member;
            }
          }),
        };
      } else {
        return obj;
      }
    });
    setChats(updatedChats);
  };

  const openNewMsg = (user, chat) => {
    if (
      (chat.lastMessage && !user.lastRead) ||
      (chat.lastMessage && user.lastRead < chat.lastMessage.timestamp)
    ) {
      updateDbUser(chat);
    }
  };

  // FIX THIS
  // ALL ARE TRYING TO UPDATE AT THE SAME TIME SO ONLY ONE IS GOING THROUGH
  // Handle opening new chat notications
  useEffect(() => {
    if (chatId && chats) {
      const thisChat = chats.find((obj) => obj._id === chatId);
      if (thisChat) {
        const thisUser = thisChat.members.find((obj) => obj.member.toString() === userDetails._id);
        openNewMsg(thisUser, thisChat);
      }
    }
  }, [chatId, chats, userDetails]);

  // Receiving message
  // Update last message in the chats array with chatId
  useEffect(() => {
    socket.on('receiveMessagePrev', (message) => {
      const newChats = chats.map((chat) => {
        if (message.conversation.toString() === chat._id) {
          return {
            ...chat,
            lastMessage: message,
          };
        } else {
          return chat;
        }
      });
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
      setChats(sortedChats);
    });

    return () => {
      socket.off('receiveMessagePrev');
    };
  }, [chats, socket]);

  // CHANGE ALL OF THIS TO GET ALL USER INFO FROM CONTACTS
  // SO THAT WHEN CONTACTS IS UPDATED WITH ONLINE/OFFLINE STATUS IT WILL SHOW

  return (
    <div className="chat-page">
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
      <div className="chat-column">
        <div className="chat-header">
          <h1>Chats</h1>
          <button onClick={() => setShowChatPopup(true)}>New chat</button>
        </div>
        <div className="chat-list">
          {chats.map((obj) => {
            let otherUser;
            if (!obj.isGroup) {
              const tmpUser = obj.members.find(
                (chatMember) => chatMember.member.toString() !== userDetails._id,
              );
              otherUser = contacts.find((contact) => contact._id === tmpUser.member.toString());
            }
            const currentUser = obj.members.find(
              (user) => user.member.toString() == userDetails._id,
            );
            return (
              <Link to={'/chats/' + obj._id} key={obj._id}>
                <div className="chat-preview">
                  <div className="chat-img">
                    {obj.isGroup && obj.groupName.slice(0, 1)}
                    {!obj.isGroup && otherUser && otherUser.firstName.slice(0, 1)}
                    {!obj.isGroup && otherUser && otherUser.isOnline && <span>*</span>}
                  </div>
                  <div className="chat-details">
                    <div className="preview-top">
                      <div>
                        {obj.isGroup && obj.groupName}
                        {!obj.isGroup &&
                          otherUser &&
                          otherUser.firstName + ' ' + otherUser.lastName}
                      </div>
                      <div className="preview-time">
                        {obj.lastMessage
                          ? DateTime.fromISO(obj.lastMessage.timestamp).toLocaleString(DateTime)
                          : DateTime.fromISO(obj.timestamp).toLocaleString(DateTime)}
                      </div>
                    </div>
                    <div className="preview-bottom">
                      <div className="preview-msg">
                        {obj.lastMessage && obj.lastMessage.text.length > 25
                          ? obj.lastMessage.text.slice(0, 25) + '...'
                          : obj.lastMessage && obj.lastMessage.text.length <= 25
                            ? obj.lastMessage.text.slice(0, 25)
                            : 'Started new chat'}
                      </div>
                      <div className="new-msg">
                        {(obj.lastMessage && currentUser && !currentUser.lastRead) ||
                        (obj.lastMessage &&
                          currentUser &&
                          currentUser.lastRead < obj.lastMessage.timestamp)
                          ? '*'
                          : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Outlet context={{ contacts, chats, userDetails, user, socket }} />
    </div>
  );
}

export default ChatPage;
