import { useOutletContext, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfileImage from './ProfileImage';

function Sidebar({ userDetails, socket, setShowProfilePopup, userHash }) {
  const { handleLogout } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="nav-btns">
        <button onClick={() => navigate('/chats')}>Chats</button>
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
};

export default Sidebar;
