import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { checkExistingChats, createNewChat } from '../helpers/chatHelpers';

function ChatPopup({ setShowChatPopup, contacts, chats, user, socket }) {
  const [isGroup, setIsGroup] = useState(false);
  const navigate = useNavigate();

  // Handle choosing contact to start new chat
  const startChat = (contact) => {
    // Check if chat with chosen contact already exists
    const existingChat = checkExistingChats(contact, chats);

    // If chat already exists, navigate to existing chat
    if (existingChat) {
      navigate('/chats/' + existingChat._id);
      setShowChatPopup(false);
    } else {
      // If chat does not exist, create new chat
      createNewChat(contact, user, socket);
      setShowChatPopup(false);
    }
  };

  return (
    <div className="blocker">
      <div className="popup-container">
        <div className="chat-popup">
          <button className="close-btn" onClick={() => setShowChatPopup(false)}>
            X
          </button>
          {!isGroup ? (
            <>
              <p>Create a new chat</p>
              <div className="non-group-users">
                <button className="grp-btn" onClick={() => setIsGroup(true)}>
                  <div className="btn-img">+</div>
                  New group
                </button>
                {contacts.map((contact) => {
                  if (contact._id !== user._id) {
                    return (
                      <button onClick={() => startChat(contact)} key={contact._id}>
                        <div className="btn-img">{contact.firstName.slice(0, 1)}</div>
                        {contact.firstName + ' ' + contact.lastName}
                      </button>
                    );
                  }
                })}
              </div>
            </>
          ) : (
            <>
              <button className="back-btn" onClick={() => setIsGroup(false)}>
                &lt;
              </button>
              <p>Select group members</p>
              <div className="group-users"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ChatPopup.propTypes = {
  setShowChatPopup: PropTypes.func,
  contacts: PropTypes.array,
  chats: PropTypes.array,
  setChats: PropTypes.func,
  user: PropTypes.object,
  socket: PropTypes.object,
};

export default ChatPopup;
