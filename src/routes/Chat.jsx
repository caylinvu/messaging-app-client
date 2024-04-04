import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MessageContainer from '../components/MessageContainer';
import ChatInfo from '../components/ChatInfo';
import GroupPopup from '../components/GroupPopup';
import ProfileImage from '../components/ProfileImage';
import FetchError from '../components/FetchError';
import Loading from '../components/Loading';
import { showNotification } from '../helpers/chatHelpers';
import { getMessages, uploadImage } from '../helpers/fetchHelpers';
import PropTypes from 'prop-types';
import { handleAlert } from '../helpers/alertHelpers';
import { receiveMessage } from '../helpers/socketHelpers';

function Chat() {
  const [messageLoading, setMessageLoading] = useState(true);
  const [messageError, setMessageError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertTimer, setAlertTimer] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
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

  // Reset message form when switching between chats
  useEffect(() => {
    setText('');
    setImage('');
    setImageError('');
    setMessageError(null);
    setMessageLoading(true);
  }, [chatId]);

  // Fetch messages
  useEffect(() => {
    if (chatId) {
      getMessages(user, chatId, setMessages, setMessageError, setMessageLoading);
    }
  }, [chatId, user]);

  // Handle selecting an image file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 1024 * 1024 * 2) {
        const form = document.querySelector('.msg-form');
        form.reset();
        setImageError('*Max file size of 2MB');
        handleAlert(showAlert, setShowAlert, alertTimer, setAlertTimer);
        return;
      } else if (
        e.target.files[0].type !== 'image/png' &&
        e.target.files[0].type !== 'image/jpg' &&
        e.target.files[0].type !== 'image/jpeg'
      ) {
        const form = document.querySelector('.msg-form');
        form.reset();
        setImageError('*Only png, jpg, and jpeg files allowed');
        handleAlert(showAlert, setShowAlert, alertTimer, setAlertTimer);
        return;
      }
    }
    setImageError('');
    setImage(e.target.files[0]);
  };

  // Handle removing a selected image file
  const cancelImage = () => {
    setImage('');
    const form = document.querySelector('.msg-form');
    form.reset();
  };

  // Handle file upload to database
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    uploadImage(user, formData, emitMessage, setText, setImage, setImageError);
  };

  // Handle emitting message object to backend
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

  // Handle sending a text/image message
  const handleSend = (e) => {
    e.preventDefault();
    if (text && !image) {
      emitMessage('');
      setText('');
      setImageError('');
    } else if (image) {
      handleUpload();
    }
  };

  // Handle receiving a new messages
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      receiveMessage(chatId, message, messages, setMessages);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [chatId, messages, socket]);

  // If a 'deleted' chatId is navigated to, redirect to /chats
  useEffect(() => {
    const currentChat = chats.find((obj) => obj._id === chatId);
    if (currentChat && currentChat.exclude.includes(user._id)) {
      navigate('/chats');
    }
  }, [chatId, chats, navigate, user]);

  // Check to see if there are any new messages to show alert on mobile back button in chat
  useEffect(() => {
    showNotification(chats, chatId, userDetails, setShowBubble);
  }, [chats, chatId, userDetails]);

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
                  <InfoBar
                    obj={obj}
                    otherUser={otherUser}
                    showBubble={showBubble}
                    groupHash={groupHash}
                    setShowChatInfo={setShowChatInfo}
                  />
                  <MessageContainer
                    messages={messages}
                    userDetails={userDetails}
                    contacts={contacts}
                    userHash={userHash}
                  />
                  {image && <ImageDisplay image={image} cancelImage={cancelImage} />}
                  {showAlert && <div className="img-err">{imageError}</div>}
                  <SendBar
                    handleSend={handleSend}
                    handleFileChange={handleFileChange}
                    text={text}
                    setText={setText}
                  />
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

function InfoBar({ obj, otherUser, showBubble, groupHash, setShowChatInfo }) {
  const navigate = useNavigate();

  return (
    <div className="info-bar">
      <div className="info-left">
        <button className="mobile-back" onClick={() => navigate('/chats')}>
          {showBubble ? (
            <>
              <img src="/chat.svg" alt="" />
              {showBubble && <span></span>}
            </>
          ) : (
            <img src="/arrow-back.svg" alt="" />
          )}
        </button>
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
        <button onClick={() => setShowChatInfo(true)}>
          <img src="/menu.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

InfoBar.propTypes = {
  obj: PropTypes.object,
  otherUser: PropTypes.object,
  showBubble: PropTypes.bool,
  groupHash: PropTypes.string,
  setShowChatInfo: PropTypes.func,
};

function ImageDisplay({ image, cancelImage }) {
  return (
    <div className="img-container">
      <div className="img-display">
        <img src={URL.createObjectURL(image)} alt="" draggable={false} />
        <button className="img-close" onClick={cancelImage}>
          <img src="/close.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

ImageDisplay.propTypes = {
  image: PropTypes.object,
  cancelImage: PropTypes.func,
};

function SendBar({ handleSend, handleFileChange, text, setText }) {
  return (
    <div onSubmit={handleSend} className="send-bar">
      <form action="" className="msg-form" autoComplete="off">
        <div className="form-group">
          <label htmlFor="send-image" className="img-upload">
            <button type="button">
              <img src="/image.svg" alt="" />
            </button>
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
          className="message-input"
          placeholder="Write a message"
        />
        <button type="submit" className="send-btn">
          <img src="/send.svg" alt="" />
        </button>
      </form>
    </div>
  );
}

SendBar.propTypes = {
  handleSend: PropTypes.func,
  handleFileChange: PropTypes.func,
  text: PropTypes.string,
  setText: PropTypes.func,
};

export default Chat;
