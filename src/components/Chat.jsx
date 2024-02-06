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
        // console.log(messageData);
      } catch (err) {
        setMessages([]);
        console.log(err);
      }
    };
    if (chatId) {
      getMessages();
    }
  }, [chatId, user.token]);

  const handleSend = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {chats.map((obj) => {
        if (obj._id === chatId) {
          let otherUser;
          if (!obj.isGroup) {
            const tmpUser = obj.members.find(
              (chatMember) => chatMember.member.toString() !== userDetails._id,
            );
            otherUser = contacts.find((contact) => contact._id === tmpUser.member.toString());
          }
          return (
            <div className="chat" key={obj._id}>
              <div className="info-bar">
                <div className="info-left">
                  <div className="info-img">
                    {obj.isGroup && obj.groupName.slice(0, 1)}
                    {!obj.isGroup && otherUser && otherUser.firstName.slice(0, 1)}
                    {!obj.isGroup && otherUser && otherUser.isOnline && <span>*</span>}
                  </div>
                  <div className="details">
                    <div>
                      {obj.isGroup && obj.groupName}
                      {!obj.isGroup && otherUser && otherUser.firstName + ' ' + otherUser.lastName}
                    </div>
                    <div>
                      {obj.isGroup && obj.members.length + ' members'}
                      {!obj.isGroup && otherUser && otherUser.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
                <div className="info-right">
                  <button>Menu</button>
                </div>
              </div>
              <MessageContainer messages={messages} userDetails={userDetails} contacts={contacts} />
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
