import { useOutletContext, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Sidebar({ userDetails }) {
  const { handleLogout } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="nav-btns">
        <button onClick={() => navigate('/chats')}>Chats</button>
        <button onClick={() => navigate('/contacts')}>Contacts</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <button className="profile-btn">
        {userDetails.firstName}
        {userDetails.isOnline && <span>*</span>}
      </button>
    </div>
  );
}

Sidebar.propTypes = {
  userDetails: PropTypes.object,
};

export default Sidebar;
