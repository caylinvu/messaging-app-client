import PropTypes from 'prop-types';
import { useState } from 'react';
import ProfileImage from './ProfileImage';

function GroupPopup({ setShowGroupPopup, chat, chats, setChats, user }) {
  const [groupName, setGroupName] = useState(chat.groupName);
  const [lastImage, setLastImage] = useState(chat.image);
  const [newImage, setNewImage] = useState('');
  const [imageError, setImageError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('groupName', groupName);
    formData.set('lastImage', lastImage ? lastImage : '');
    formData.append('image', newImage);

    try {
      const response = await fetch('http://localhost:3000/api/conversations/' + chat._id, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });
      const responseData = await response.json();
      if (response.status === 200) {
        updateLocalChat(responseData);
        setShowGroupPopup(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateLocalChat = (data) => {
    const updatedChats = chats.map((obj) => {
      if (obj._id === chat._id) {
        return {
          ...obj,
          groupName: data.groupName,
          image: data.image,
        };
      } else {
        return obj;
      }
    });
    console.log(updatedChats);
    setChats(updatedChats);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 1024 * 1024 * 1) {
        setImageError('*Max file size of 1MB');
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
        <div className="group-popup">
          <button className="close-btn" onClick={() => setShowGroupPopup(false)}>
            X
          </button>
          <h3>Group Profile</h3>
          <p>Edit your group information</p>
          <form action="" className="group-form" onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="groupName">Group name</label>
              <input
                type="text"
                name="groupName"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <p>Photo</p>
              <div className="file-display">
                {!newImage ? (
                  <ProfileImage chat={chat} imgClass="group-img" />
                ) : (
                  <div className="group-img">
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
              <span>{imageError}</span>
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

GroupPopup.propTypes = {
  setShowGroupPopup: PropTypes.func,
  chat: PropTypes.object,
  chats: PropTypes.array,
  setChats: PropTypes.func,
  user: PropTypes.object,
};

export default GroupPopup;