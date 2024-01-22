import { Outlet, useOutletContext, Link } from 'react-router-dom';
import { useState } from 'react';
import { DateTime } from 'luxon';

function ChatPage() {
  const [activeChat, setActiveChat] = useState('');
  const { contacts, chats, userDetails } = useOutletContext();

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
            }
            return (
              <Link to={'/chats/' + obj._id} onClick={() => setActiveChat(obj._id)}>
                <div className="chat-preview" key={obj._id}>
                  <div className="chat-img">
                    {obj.isGroup
                      ? obj.groupName.slice(0, 1)
                      : otherUser.member.firstName.slice(0, 1)}
                  </div>
                  <div className="chat-details">
                    <div className="preview-top">
                      <div>
                        {obj.isGroup
                          ? obj.groupName
                          : otherUser.member.firstName + ' ' + otherUser.member.lastName}
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
        <Outlet />
      ) : (
        <div className="intro-page">
          <img src="/jam.png" alt="" />
          <p>Welcome to Cherry Chat! Select a chat or start a new conversation</p>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
