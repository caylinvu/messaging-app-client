import PropTypes from 'prop-types';

function ProfileImage({ chat, contact, showOnlineStatus, imgClass, socket }) {
  if (chat && chat.isGroup) {
    // if representing group
    if (chat.image) {
      // if group has image
      return (
        <div className={imgClass}>
          <img
            src={'http://localhost:3000/api/img/conversation/' + chat._id}
            alt=""
            draggable={false}
          />
        </div>
      );
    } else {
      // if group has no image
      return <div className={imgClass}>{chat.groupName.slice(0, 1).toUpperCase()}</div>;
    }
  } else {
    // if representing single user
    if (contact.image) {
      // if user has image
      return (
        <div className={imgClass}>
          <img src={'http://localhost:3000/api/img/user/' + contact._id} alt="" draggable={false} />
          {showOnlineStatus &&
            ((socket && socket.connected) || (!socket && contact.isOnline) ? <span>*</span> : '')}
        </div>
      );
    } else {
      // if user has no image
      return (
        <div className={imgClass}>
          {contact.firstName.slice(0, 1).toUpperCase()}
          {showOnlineStatus &&
            ((socket && socket.connected) || (!socket && contact.isOnline) ? <span>*</span> : '')}
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
};

export default ProfileImage;
