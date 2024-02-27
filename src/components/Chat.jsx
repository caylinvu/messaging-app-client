import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MessageContainer from './MessageContainer';
import ChatInfo from './ChatInfo';
import GroupPopup from './GroupPopup';
import ProfileImage from './ProfileImage';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [text, setText] = useState('');
  const { chatId } = useParams();
  const {
    contacts,
    chats,
    setChats,
    userDetails,
    user,
    socket,
    userHash,
    groupHash,
    setGroupHash,
  } = useOutletContext();
  const navigate = useNavigate();

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

  // Emitting message
  // Send new message with msg object (including text, author, conversation, image, and timestamp)
  // Save new message to local messages state and broadcast OR just emit to all including sender
  const handleSend = (e) => {
    e.preventDefault();
    if (text) {
      const msg = {
        text: text,
        author: user._id,
        conversation: chatId,
        image: '',
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendMessage', msg);
      setText('');
    }
  };

  // Receiving message
  // Save new message to messages object
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (chatId === message.conversation.toString()) {
        const newMessages = [...messages, message];
        // Maybe just add message to end of array for performance???
        const sortedMessages = newMessages.sort((x, y) => {
          return new Date(x.timestamp) - new Date(y.timestamp);
        });
        setMessages(sortedMessages);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [chatId, messages, socket]);

  useEffect(() => {
    const currentChat = chats.find((obj) => obj._id === chatId);
    if (currentChat && currentChat.exclude.includes(user._id)) {
      navigate('/chats');
    }
  }, [chatId, chats, navigate, user]);

  return (
    <>
      {chats.map((obj) => {
        if (obj._id === chatId && !obj.exclude.includes(user._id)) {
          let otherUser;
          if (!obj.isGroup) {
            const tmpUser = obj.members.find((chatMember) => chatMember.toString() !== user._id);
            otherUser = contacts.find((contact) => contact._id === tmpUser.toString());
          }
          return (
            <div className="chat" key={obj._id}>
              <div className="info-bar">
                <div className="info-left">
                  <ProfileImage
                    chat={obj}
                    contact={otherUser}
                    showOnlineStatus={true}
                    imgClass="info-img"
                    groupHash={obj.isGroup ? groupHash : ''}
                  />
                  <div className="details">
                    <div>
                      {obj.isGroup && obj.groupName}
                      {!obj.isGroup && otherUser && otherUser.firstName + ' ' + otherUser.lastName}
                    </div>
                    <div>
                      {obj.isGroup && obj.members.length + ' members'}
                      {!obj.isGroup && otherUser && (otherUser.isOnline ? 'Online' : 'Offline')}
                    </div>
                  </div>
                </div>
                <div className="info-right">
                  <button onClick={() => setShowChatInfo(true)}>Info</button>
                </div>
              </div>
              <MessageContainer
                messages={messages}
                userDetails={userDetails}
                contacts={contacts}
                userHash={userHash}
              />
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
              {showChatInfo && (
                <ChatInfo
                  setShowChatInfo={setShowChatInfo}
                  setShowGroupPopup={setShowGroupPopup}
                  chat={obj}
                  otherUser={otherUser}
                  contacts={contacts}
                  socket={socket}
                  userDetails={userDetails}
                  chats={chats}
                  setChats={setChats}
                  user={user}
                  userHash={userHash}
                  groupHash={groupHash}
                />
              )}
              {showGroupPopup && (
                <GroupPopup
                  setShowGroupPopup={setShowGroupPopup}
                  chat={obj}
                  chats={chats}
                  setChats={setChats}
                  user={user}
                  groupHash={groupHash}
                  setGroupHash={setGroupHash}
                />
              )}
            </div>
          );
        }
      })}
    </>
  );
}

export default Chat;
