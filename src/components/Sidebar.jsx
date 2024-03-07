import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProfileImage from './ProfileImage';

function Sidebar({ userDetails, socket, setShowProfilePopup, userHash, chats }) {
  const [showBubble, setShowBubble] = useState(false);
  const { chatId } = useParams();
  const { handleLogout } = useOutletContext();
  const navigate = useNavigate();

  // Check to see if there are any new messages to show alert on 'Chats' button on sidebar
  useEffect(() => {
    const notifications = chats.filter((obj) => {
      let userConv;
      if (userDetails.convData) {
        userConv = userDetails.convData.find((conv) => conv.conv.toString() === obj._id);
      }
      if (
        (obj.lastMessage && userConv && !userConv.lastRead) ||
        (obj.lastMessage && userConv && userConv.lastRead < obj.lastMessage.timestamp)
      ) {
        return obj;
      }
    });

    if (chatId && notifications.length === 1 && notifications[0]._id === chatId) {
      setShowBubble(false);
    } else if (notifications.length >= 1) {
      setShowBubble(true);
    } else {
      setShowBubble(false);
    }
  }, [chats, chatId, userDetails]);

  return (
    <div className="sidebar">
      <div className="nav-btns">
        <button className="chats-btn" onClick={() => navigate('/chats')}>
          Chats
          {showBubble && <span>*</span>}
        </button>
        <button onClick={() => navigate('/contacts')}>Contacts</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <button className="profile-btn" onClick={() => setShowProfilePopup(true)}>
        <ProfileImage
          contact={userDetails}
          showOnlineStatus={true}
          imgClass="sidebar-img"
          socket={socket}
          userHash={userHash}
        />
      </button>
    </div>
  );
}

Sidebar.propTypes = {
  userDetails: PropTypes.object,
  socket: PropTypes.object,
  setShowProfilePopup: PropTypes.func,
  userHash: PropTypes.string,
  chats: PropTypes.array,
};

export default Sidebar;
