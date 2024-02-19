import PropTypes from 'prop-types';
import { useState } from 'react';

function ProfilePopup({ setShowProfilePopup, contacts, setContacts, user }) {
  const [currentUser, setCurrentUser] = useState(contacts.find((obj) => obj._id === user._id));
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [image, setImage] = useState(currentUser.image);
  const [bio, setBio] = useState(currentUser.bio);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users/' + user._id, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          image: image,
          bio: bio,
        }),
      });
      if (response.status === 200) {
        updateLocalUser();
        setShowProfilePopup(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateLocalUser = () => {
    const updatedContacts = contacts.map((obj) => {
      if (obj._id === user._id) {
        return {
          ...obj,
          firstName: firstName,
          lastName: lastName,
          image: image,
          bio: bio,
        };
      } else {
        return obj;
      }
    });
    setContacts(updatedContacts);
  };

  return (
    <div className="blocker">
      <div className="popup-container">
        <div className="profile-popup">
          <button className="close-btn" onClick={() => setShowProfilePopup(false)}>
            X
          </button>
          <h3>Profile</h3>
          <p>Edit your public information</p>
          <form action="" className="profile-form" onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea name="bio" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <button type="submit" className="save-btn">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;

ProfilePopup.propTypes = {
  setShowProfilePopup: PropTypes.func,
  contacts: PropTypes.array,
  setContacts: PropTypes.func,
  user: PropTypes.object,
};
