import { useParams, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

function Chat() {
  const [text, setText] = useState('');
  const { chatId } = useParams();
  const { contacts, chats, userDetails } = useOutletContext();
  const currentChat = chats.find((obj) => obj._id === chatId);
  let otherUser;
  if (!currentChat.isGroup) {
    otherUser = currentChat.members.find((chatMember) => chatMember.member._id !== userDetails._id);
    otherUser = otherUser.member;
  }

  const handleSend = (e) => {
    e.preventDefault();
  };

  return (
    <div className="chat">
      <div className="info-bar">
        <div className="info-left">
          <div className="info-img">
            {currentChat.isGroup
              ? currentChat.groupName.slice(0, 1)
              : otherUser.firstName.slice(0, 1)}
          </div>
          <div className="details">
            <div>
              {currentChat.isGroup
                ? currentChat.groupName
                : otherUser.firstName + ' ' + otherUser.lastName}
            </div>
            <div>
              {currentChat.isGroup
                ? currentChat.members.length + ' members'
                : otherUser.isOnline
                  ? 'Online'
                  : 'Offline'}
            </div>
          </div>
        </div>
        <div className="info-right">
          <button>Menu</button>
        </div>
      </div>
      <div className="chat-container"></div>
      <div onSubmit={handleSend} className="send-bar">
        <form action="" className="msg-form">
          <input
            type="text"
            name="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
