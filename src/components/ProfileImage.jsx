import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

function ProfileImage({ chat, contact, showOnlineStatus, imgClass, socket, userHash, groupHash }) {
  const [userString, setUserString] = useState(userHash ? '?' + userHash : '');
  const [groupString, setGroupString] = useState(groupHash ? '?' + groupHash : '');

  useEffect(() => {
    setUserString(userHash ? '?' + userHash : '');
  }, [userHash]);

  useEffect(() => {
    setGroupString(groupHash ? '?' + groupHash : '');
  }, [groupHash]);

  if (chat && chat.isGroup) {
    // if representing group
    if (chat.image) {
      // if group has image
      return (
        <div className={imgClass + ' has-img'}>
          <img
            src={'http://localhost:3000/api/img/conversation/' + chat._id + groupString}
            alt=""
            draggable={false}
          />
        </div>
      );
    } else {
      // if group has no image
      return (
        <div className={imgClass + ' group-icon'}>
          <img src="/group.svg" alt="" draggable={false} />
        </div>
      );
    }
  } else if (contact) {
    // if representing single user
    if (contact.image) {
      // if user has image
      return (
        <div className={imgClass + ' has-img'}>
          <img
            src={'http://localhost:3000/api/img/user/' + contact._id + userString}
            alt=""
            draggable={false}
          />
          {showOnlineStatus &&
            ((socket && socket.connected) || (!socket && contact.isOnline) ? <span></span> : '')}
        </div>
      );
    } else {
      // if user has no image
      return (
        <div className={imgClass + ' person-icon'}>
          <img src="/person.svg" alt="" draggable={false} />
          {showOnlineStatus &&
            ((socket && socket.connected) || (!socket && contact.isOnline) ? <span></span> : '')}
        </div>
      );
    }
  }
}

ProfileImage.propTypes = {
  chat: PropTypes.object,
  contact: PropTypes.object,
  showOnlineStatus: PropTypes.bool,
  imgClass: PropTypes.string,
  socket: PropTypes.object,
  userHash: PropTypes.string,
  groupHash: PropTypes.string,
};

export default ProfileImage;
