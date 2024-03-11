import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MessageContainer from './MessageContainer';
import ChatInfo from './ChatInfo';
import GroupPopup from './GroupPopup';
import ProfileImage from './ProfileImage';
import FetchError from './FetchError';
import Loading from './Loading';

function Chat() {
  const [messageLoading, setMessageLoading] = useState(true);
  const [messageError, setMessageError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');
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
    setText('');
    setImage('');
    setImageError('');
    setMessageError(null);
    setMessageLoading(true);
  }, [chatId]);

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
          if (response.status === 403) {
            console.log('forbidden');
            throw { message: response.statusText, status: response.status };
          }
          // console.log(response);
          const error = await response.json();
          // console.log(error);
          throw { message: error.message || response.statusText, status: response.status };
          // throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }
        const messageData = await response.json();
        setMessages(messageData);
        setMessageError(null);
      } catch (err) {
        setMessages([]);
        setMessageError(err);
        console.log(err);
        // throw new Error('Failed to fetch messages');
      } finally {
        setMessageLoading(false);
      }
    };
    if (chatId) {
      getMessages();
    }
  }, [chatId, user.token]);

  // Handle selecting file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 1024 * 1024 * 2) {
        setImageError('*Max file size of 2MB');
        return;
      } else if (
        e.target.files[0].type !== 'image/png' &&
        e.target.files[0].type !== 'image/jpg' &&
        e.target.files[0].type !== 'image/jpeg'
      ) {
        setImageError('*Only png, jpg, and jpeg files allowed');
        return;
      }
    }
    setImageError('');
    setImage(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  // Handle cancelling an input image
  const cancelImage = () => {
    setImage('');
    const form = document.querySelector('.msg-form');
    form.reset();
  };

  // Handle file upload
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3000/api/messages/send-img', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });
      const responseData = await response.json();
      console.log(responseData);
      if (response.status === 200) {
        console.log(responseData);
        emitMessage(responseData.image);
        setText('');
        setImage('');
        setImageError('');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle emitting message
  const emitMessage = (img) => {
    const msg = {
      text: text,
      author: user._id,
      conversation: chatId,
      image: img,
      timestamp: new Date().toISOString(),
    };
    socket.emit('sendMessage', msg);
  };

  // Send new message with msg object (including text, author, conversation, image, and timestamp)
  // Save new message to local messages state and broadcast OR just emit to all including sender
  const handleSend = (e) => {
    e.preventDefault();
    if (text && !image) {
      console.log('text only');
      emitMessage('');
      setText('');
      setImageError('');
    } else if (image) {
      console.log('image uploaded');
      handleUpload();
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
    // if (!currentChat || (currentChat && currentChat.exclude.includes(user._id))) {
    if (currentChat && currentChat.exclude.includes(user._id)) {
      navigate('/chats');
    }
  }, [chatId, chats, navigate, user]);

  return (
    <>
      {messageLoading ? (
        <Loading loadType="message" />
      ) : messageError ? (
        <FetchError error={messageError} fetchType="message" />
      ) : (
        <>
          {chats.map((obj) => {
            if (obj._id === chatId && !obj.exclude.includes(user._id)) {
              let otherUser;
              if (!obj.isGroup) {
                const tmpUser = obj.members.find(
                  (chatMember) => chatMember.toString() !== user._id,
                );
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
                          {!obj.isGroup &&
                            otherUser &&
                            otherUser.firstName + ' ' + otherUser.lastName}
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
                  {image && (
                    <div className="img-container">
                      <div className="img-display">
                        <img src={URL.createObjectURL(image)} alt="" draggable={false} />
                        <button className="img-close" onClick={cancelImage}>
                          X
                        </button>
                      </div>
                    </div>
                  )}
                  <span className="img-err">{imageError}</span>
                  <div onSubmit={handleSend} className="send-bar">
                    <form action="" className="msg-form" autoComplete="off">
                      <div className="form-group">
                        <label htmlFor="send-image" className="img-upload">
                          <button type="button">Image</button>
                        </label>
                        <input
                          type="file"
                          name="send-image"
                          id="send-image"
                          accept="image/png,image/jpg,image/jpeg"
                          onChange={handleFileChange}
                          className="file-input"
                        />
                      </div>
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
      )}
    </>
  );
}

export default Chat;
