import { useOutletContext, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import ProfileImage from './ProfileImage';

function Sidebar({ userDetails, socket, setShowProfilePopup }) {
  const { handleLogout } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

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
        />
      </button>
    </div>
  );
}

Sidebar.propTypes = {
  userDetails: PropTypes.object,
  socket: PropTypes.object,
  setShowProfilePopup: PropTypes.func,
};

export default Sidebar;
