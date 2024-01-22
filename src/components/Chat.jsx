import { useParams, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MessageContainer from './MessageContainer';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { chatId } = useParams();
  const { contacts, chats, userDetails, user } = useOutletContext();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/conversations/' + chatId + '/messages',
          {
            headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
          },
        );
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }
        const messageData = await response.json();
        setMessages(messageData);
        console.log(messageData);
      } catch (err) {
        setMessages([]);
        console.log(err);
      }
    };
    if (chatId) {
      getMessages();
    }
  }, [chatId]);

  const handleSend = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {chats.map((obj) => {
        if (obj._id === chatId) {
          let otherUser;
          if (!obj.isGroup) {
            otherUser = obj.members.find((chatMember) => chatMember.member._id !== userDetails._id);
            otherUser = otherUser.member;
          }
          return (
            <div className="chat" key={obj._id}>
              <div className="info-bar">
                <div className="info-left">
                  <div className="info-img">
                    {obj.isGroup ? obj.groupName.slice(0, 1) : otherUser.firstName.slice(0, 1)}
                  </div>
                  <div className="details">
                    <div>
                      {obj.isGroup ? obj.groupName : otherUser.firstName + ' ' + otherUser.lastName}
                    </div>
                    <div>
                      {obj.isGroup
                        ? obj.members.length + ' members'
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
              <MessageContainer messages={messages} userDetails={userDetails} />
              {/* maybe need contacts, currentChat, and otherUser */}
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
      })}
    </>
  );
}

export default Chat;
