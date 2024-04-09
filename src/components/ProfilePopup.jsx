import PropTypes from 'prop-types';
import { useState } from 'react';
import ProfileImage from './ProfileImage';
import Button from './Button';
import { apiLink } from '../apiLink';

function ProfilePopup({ setShowProfilePopup, contacts, setContacts, user, userHash, setUserHash }) {
  const currentUser = contacts.find((obj) => obj._id === user._id);
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [newImage, setNewImage] = useState('');
  const [bio, setBio] = useState(currentUser.bio);
  const [imageError, setImageError] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('firstName', firstName);
    formData.set('lastName', lastName);
    formData.set('lastImage', currentUser.image ? currentUser.image : '');
    formData.append('image', newImage);
    formData.set('bio', bio ? bio : '');

    try {
      const response = await fetch(apiLink + '/api/users/' + user._id, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });
      const responseData = await response.json();
      if (response.status === 200) {
        if (newImage) {
          setUserHash(Math.random().toString(36));
        }
        setErrors([]);
        updateLocalUser(responseData);
        setShowProfilePopup(false);
      } else if (!response.ok) {
        setImageError('');
        setErrors(responseData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateLocalUser = (data) => {
    const updatedContacts = contacts.map((obj) => {
      if (obj._id === user._id) {
        return {
          ...obj,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
          bio: data.bio,
        };
      } else {
        return obj;
      }
    });
    setContacts(updatedContacts);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 1024 * 1024 * 2) {
        setImageError('*Max file size of 2MB');
        return;
      } else if (
        e.target.files[0].type !== 'image/png' &&
        e.target.files[0].type !== 'image/jpg' &&
        e.target.files[0].type !== 'image/jpeg'
      ) {
        setImageError('*Only png, jpg, and jpeg files allowed');
        return;
      }
    }
    setImageError('');
    setNewImage(e.target.files[0]);
  };

  return (
    <div className="blocker">
      <div className="popup-container">
        <div className="profile-popup">
          <button className="close-btn" onClick={() => setShowProfilePopup(false)}>
            <img src="/close.svg" alt="" />
          </button>
          <h3>Profile</h3>
          <p>Edit your public information</p>
          <form action="" className="profile-form" onSubmit={handleSave} autoComplete="off">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="text-input"
              />
              {errors.map((error) => {
                if (error.path === 'firstName') {
                  return <span key={error.path}>{error.msg}</span>;
                }
              })}
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
                className="text-input"
              />
              {errors.map((error) => {
                if (error.path === 'lastName') {
                  return <span key={error.path}>{error.msg}</span>;
                }
              })}
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                name="bio"
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bio-input"
              />
            </div>
            <div className="form-group">
              <p>Photo</p>
              <div className="file-display">
                {!newImage ? (
                  <ProfileImage contact={currentUser} imgClass="profile-img" userHash={userHash} />
                ) : (
                  <div className="profile-img">
                    <img src={URL.createObjectURL(newImage)} alt="" draggable={false} />
                  </div>
                )}
                <label htmlFor="image" className="file-change">
                  Change photo
                </label>
              </div>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/png,image/jpg,image/jpeg"
                onChange={handleFileChange}
                className="file-input"
              />
              {errors.map((error) => {
                if (error.path === 'image') {
                  return <span key={error.path}>{error.msg}</span>;
                }
              })}
              <span className="profile-img-err">{imageError}</span>
            </div>
            <Button btnText="Save" btnClass="save-btn" btnType="submit" />
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
  userHash: PropTypes.string,
  setUserHash: PropTypes.func,
};
