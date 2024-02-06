import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function ChatPopup({ setShowChatPopup, contacts, chats, user, socket }) {
  const navigate = useNavigate();

  // Handle choosing contact to start new chat
  const startChat = (contact) => {
    // Check if chat with chosen contact already exists
    const existingChat = chats.find((obj) => {
      const userExists = obj.members.find((member) => {
        if (obj.members.length === 2 && member.member.toString() === contact._id) {
          return member.member;
        }
      });

      if (userExists) {
        return obj;
      }
    });

    // If chat already exists, navigate to existing chat
    if (existingChat) {
      navigate('/chats/' + existingChat._id);
      setShowChatPopup(false);
    } else {
      // Create array with member id's
      const newMembers = [{ member: contact._id }, { member: user._id }];
      // If chat does not exist, create new chat (including members array, isGroup, and groupName)
      const conv = {
        members: newMembers,
        isGroup: false,
        groupName: '',
        timestamp: new Date().toISOString(),
      };

      const convData = {
        conv: conv,
        receiver: contact._id,
      };
      // Send 'conv' object to backend
      socket.emit('createConversation', convData);
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
          <p>Create a new chat</p>
          <div className="popup-users">
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
