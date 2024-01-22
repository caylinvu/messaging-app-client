import { Outlet, useOutletContext, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

function ChatPage() {
  const [activeChat, setActiveChat] = useState('');
  const { contacts, chats, userDetails, user } = useOutletContext();
  const { chatId } = useParams();

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId);
    }
  }, []);

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
              otherUser = otherUser.member;
            }
            return (
              <Link to={'/chats/' + obj._id} onClick={() => setActiveChat(obj._id)} key={obj._id}>
                <div className="chat-preview">
                  <div className="chat-img">
                    {obj.isGroup ? obj.groupName.slice(0, 1) : otherUser.firstName.slice(0, 1)}
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
                      {obj.lastMessage && obj.lastMessage.text.length > 25
                        ? obj.lastMessage.text.slice(0, 25) + '...'
                        : obj.lastMessage && obj.lastMessage.text.length <= 25
                          ? obj.lastMessage.text.slice(0, 25)
                          : 'Started new chat'}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {activeChat ? (
        <Outlet context={{ contacts, chats, userDetails, user }} />
      ) : (
        <div className="intro-page">
          <img src="/jam.png" alt="" />
          <p>Welcome to Cherry Chat! Select a chat or start a new conversation</p>
        </div>
      )}
    </div>
  );
}

// Change so that the intro page is within the Outlet, and the activeChat is set on the Outlet
// page depending on the conversationId param, so that on refresh it will stay within active chat

export default ChatPage;
