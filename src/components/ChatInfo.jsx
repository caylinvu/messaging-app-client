import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';

function ChatInfo({
  setShowChatInfo,
  chat,
  otherUser,
  contacts,
  socket,
  userDetails,
  chats,
  setChats,
  user,
}) {
  const navigate = useNavigate();

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const updateExclusions = async (updatedChats) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/conversations/' + chat._id + '/exclude/' + userDetails._id,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
        },
      );
      if (response.status === 200) {
        setChats(updatedChats);
        navigate('/chats');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteChat = () => {
    // Add current user to exclusions array on current chat and setChats() locally
    const exclusions = [...chat.exclude, userDetails._id];
    console.log(exclusions);

    const updatedChats = chats.map((obj) => {
      if (obj._id === chat._id) {
        return {
          ...obj,
          exclude: exclusions,
        };
      } else {
        return obj;
      }
    });

    // Send PUT request to backend to update the exclusions
    updateExclusions(updatedChats);
  };

  return (
    <div className="blocker" onClick={() => setShowChatInfo(false)}>
      <div className="info-container" onClick={stopPropagation}>
        <div className="chat-info">
          <div className="tab-top">
            <div className="tab-img">
              {chat.isGroup && chat.groupName.slice(0, 1)}
              {!chat.isGroup && otherUser && otherUser.firstName.slice(0, 1)}
              {!chat.isGroup && otherUser && otherUser.isOnline && <span>*</span>}
            </div>
            <div className="tab-name">
              {chat.isGroup && chat.groupName}
              {!chat.isGroup && otherUser && otherUser.firstName + ' ' + otherUser.lastName}
            </div>
            <div className="tab-status">
              {chat.isGroup && chat.members.length + ' members'}
              {!chat.isGroup && otherUser && (otherUser.isOnline ? 'Online' : 'Offline')}
            </div>
          </div>
          <button className="delete-btn" onClick={() => deleteChat()}>
            Delete chat
          </button>
          {chat.isGroup ? (
            <div className="tab-members">
              <h3>Members</h3>
              <div>
                <div className="tab-members-img">
                  {userDetails.firstName.slice(0, 1)}
                  {socket.connected && <span>*</span>}
                </div>
                <div className="tab-members-name">You</div>
              </div>
              {contacts.map((contact) => {
                if (chat.members.includes(contact._id) && contact._id !== userDetails._id) {
                  return (
                    <div key={contact._id}>
                      <div className="tab-members-img">
                        {contact.firstName.slice(0, 1)}
                        {contact.isOnline && <span>*</span>}
                      </div>
                      <div className="tab-members-name">
                        {contact.firstName + ' ' + contact.lastName}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <div className="tab-user-info">
              <div className="tab-bio">
                <p>Bio</p>
                <p>{otherUser.bio ? otherUser.bio : '(No bio available)'}</p>
              </div>
              <div className="tab-joined">
                <p>Joined</p>
                <p>{DateTime.fromISO(otherUser.timestamp).toLocaleString(DateTime.DATE_MED)}</p>
              </div>
            </div>
          )}
          <button className="close-btn" onClick={() => setShowChatInfo(false)}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}

ChatInfo.propTypes = {
  setShowChatInfo: PropTypes.func,
  chat: PropTypes.object,
  otherUser: PropTypes.object,
  contacts: PropTypes.array,
  socket: PropTypes.object,
  userDetails: PropTypes.object,
  chats: PropTypes.array,
  setChats: PropTypes.func,
  user: PropTypes.object,
};

export default ChatInfo;
