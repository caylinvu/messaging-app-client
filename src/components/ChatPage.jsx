import { Outlet, useOutletContext, Link, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useEffect } from 'react';

function ChatPage() {
  const { contacts, chats, setChats, userDetails, user } = useOutletContext();
  const { chatId } = useParams();

  const updateDbUser = async (chat) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/conversations/' + chat._id + '/timestamp/' + user._id,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
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
          members: obj.members.map((user) => {
            if (user.member._id === userDetails._id) {
              return {
                ...user,
                lastRead: new Date().toISOString(),
              };
            } else {
              return user;
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

  // Handle opening new chat notications
  useEffect(() => {
    if (chatId && chats) {
      const thisChat = chats.find((obj) => obj._id === chatId);
      if (thisChat) {
        const thisUser = thisChat.members.find((obj) => obj.member._id === userDetails._id);
        openNewMsg(thisUser, thisChat);
      }
    }
  });

  // CHANGE ALL OF THIS TO GET ALL USER INFO FROM CONTACTS
  // SO THAT WHEN CONTACTS IS UPDATED WITH ONLINE/OFFLINE STATUS IT WILL SHOW

  return (
    <div className="chat-page">
      <div className="chat-column">
        <div className="chat-header">
          <h1>Chats</h1>
          <button>New chat</button>
        </div>
        <div className="chat-list">
          {chats.map((obj) => {
            let otherUser;
            if (!obj.isGroup) {
              otherUser = obj.members.find(
                (chatMember) => chatMember.member._id !== userDetails._id,
              );
              let tmpUser = otherUser.member;
              otherUser = contacts.find((contact) => contact._id === tmpUser._id);
            }
            const currentUser = obj.members.find((user) => user.member._id == userDetails._id);
            return (
              <Link to={'/chats/' + obj._id} key={obj._id}>
                <div className="chat-preview">
                  <div className="chat-img">
                    {obj.isGroup ? obj.groupName.slice(0, 1) : otherUser.firstName.slice(0, 1)}
                    {!obj.isGroup && otherUser.isOnline && <span>*</span>}
                  </div>
                  <div className="chat-details">
                    <div className="preview-top">
                      <div>
                        {obj.isGroup
                          ? obj.groupName
                          : otherUser.firstName + ' ' + otherUser.lastName}
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
      <Outlet context={{ contacts, chats, userDetails, user }} />
    </div>
  );
}

// Change so that the intro page is within the Outlet, and the activeChat is set on the Outlet
// page depending on the conversationId param, so that on refresh it will stay within active chat

export default ChatPage;
