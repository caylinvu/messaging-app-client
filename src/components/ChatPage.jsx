import { Outlet, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

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
              <div className="chat-preview" key={obj._id}>
                {obj.isGroup
                  ? obj.groupName
                  : otherUser.member.firstName + ' ' + otherUser.member.lastName}
              </div>
            );
          })}
        </div>
      </div>
      {activeChat ? <Outlet /> : <div>Please select chat</div>}
    </div>
  );
}

export default ChatPage;
