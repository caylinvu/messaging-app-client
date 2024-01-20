import { useOutletContext, useNavigate } from 'react-router-dom';

function Sidebar() {
  const { handleLogout } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="nav-btns">
        <button onClick={() => navigate('/chats')}>Chats</button>
        <button onClick={() => navigate('/contacts')}>Contacts</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <button className="profile-btn">Profile</button>
    </div>
  );
}

export default Sidebar;
