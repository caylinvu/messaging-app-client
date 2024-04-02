import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProfileImage from './ProfileImage';
import { showNotification } from '../helpers/chatHelpers';

function Sidebar({ userDetails, socket, setShowProfilePopup, userHash, chats }) {
  const [showBubble, setShowBubble] = useState(false);
  const { chatId } = useParams();
  const { handleLogout } = useOutletContext();
  const navigate = useNavigate();

  // Check to see if there are any new messages to show alert on 'Chats' button on sidebar
  useEffect(() => {
    showNotification(chats, chatId, userDetails, setShowBubble);
  }, [chats, chatId, userDetails]);

  return (
    <div className="sidebar">
      <div className="nav-btns">
        <button className="chats-btn" onClick={() => navigate('/chats')}>
          <img src="/chat.svg" alt="" />
          {showBubble && <span></span>}
          <div className="hover-text">Chats</div>
        </button>
        <button onClick={() => navigate('/contacts')}>
          <img src="/contacts.svg" alt="" />
          <div className="hover-text">Contacts</div>
        </button>
        <button onClick={handleLogout}>
          <img src="/logout.svg" alt="" />
          <div className="hover-text">Logout</div>
        </button>
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
