import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  checkExistingChats,
  createNewChat,
  createNewGroup,
  handleExclusions,
} from '../helpers/chatHelpers';
import { removeExclusion } from '../helpers/fetchHelpers';
import ProfileImage from './ProfileImage';

function ChatPopup({ setShowChatPopup, contacts, chats, setChats, user, socket }) {
  const [isGroup, setIsGroup] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupError, setGroupError] = useState(null);
  const navigate = useNavigate();

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Handle choosing contact to start new non-group chat
  const startChat = (contact) => {
    // Check if chat with chosen contact already exists
    const existingChat = checkExistingChats(contact, chats);

    // If chat already exists, navigate to existing chat
    if (existingChat) {
      if (existingChat.exclude.includes(user._id)) {
        console.log('User is included in exclusion');
        const updatedChats = handleExclusions(existingChat, chats, user);
        removeExclusion(setChats, updatedChats, existingChat, user, navigate, setShowChatPopup);
      } else {
        console.log('User is not included in exclusion');
        navigate('/chats/' + existingChat._id);
        setShowChatPopup(false);
      }
    } else {
      // If chat does not exist, create new chat
      createNewChat(contact, user, socket);
      setShowChatPopup(false);
    }
  };

  // Handle checkbox input (add/remove user from groupUsers array)
  const handleChange = (e) => {
    let users = [];
    if (e.target.checked) {
      users = [...groupUsers, e.target.value];
    } else {
      users = groupUsers.filter((obj) => obj !== e.target.value);
    }
    // console.log(users);
    setGroupUsers(users);
  };

  // Handle selecting users (minimum of 2 users)
  const selectUsers = () => {
    if (groupUsers.length < 2) {
      setGroupError('*Please select at least 2 users');
    } else {
      setIsFinal(true);
      setGroupError(null);
    }
  };

  // Handle navigating back to non-group user list from selecting group members
  const goBack = () => {
    setIsGroup(false);
    setGroupUsers([]);
    setGroupName('');
    setGroupError(null);
  };

  const startGroup = (e) => {
    e.preventDefault();
    createNewGroup(groupName, groupUsers, user, socket);
    setShowChatPopup(false);
  };

  return (
    <div className="blocker" onClick={() => setShowChatPopup(false)}>
      <div className="popup-container" onClick={stopPropagation}>
        <div className="chat-popup">
          <button className="close-btn" onClick={() => setShowChatPopup(false)}>
            X
          </button>
          {!isGroup ? (
            <>
              <p>Create a new chat</p>
              <div className="non-group-users">
                <button className="grp-btn" onClick={() => setIsGroup(true)}>
                  <div className="btn-img">+</div>
                  New group
                </button>
                {contacts.map((contact) => {
                  if (contact._id !== user._id) {
                    return (
                      <button onClick={() => startChat(contact)} key={contact._id}>
                        <ProfileImage contact={contact} imgClass="btn-img" />
                        {contact.firstName + ' ' + contact.lastName}
                      </button>
                    );
                  }
                })}
              </div>
            </>
          ) : isGroup && !isFinal ? (
            <>
              <button className="back-btn" onClick={goBack}>
                &lt;
              </button>
              <p>Select group members</p>
              <div className="group-users">
                {contacts.map((contact) => {
                  if (contact._id !== user._id) {
                    return (
                      <label htmlFor={contact._id} key={contact._id} className="user-select">
                        <div className="label-info">
                          <ProfileImage contact={contact} imgClass="btn-img" />
                          <div>{contact.firstName + ' ' + contact.lastName}</div>
                        </div>
                        <input
                          type="checkbox"
                          name="users"
                          id={contact._id}
                          value={contact._id}
                          onChange={(e) => handleChange(e)}
                          checked={groupUsers.includes(contact._id)}
                        />
                      </label>
                    );
                  }
                })}
              </div>
              <span className="group-err">{groupError}</span>
              <button className="next-btn" onClick={selectUsers}>
                Next
              </button>
            </>
          ) : (
            <>
              <button className="back-btn" onClick={() => setIsFinal(false)}>
                &lt;
              </button>
              <p>Name group</p>
              <form action="" className="create-group-form" onSubmit={startGroup}>
                <input
                  type="text"
                  name="groupName"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                  required
                />
                <p className="members-title">Members</p>
                <div className="added-users">
                  {contacts.map((contact) => {
                    if (groupUsers.includes(contact._id)) {
                      return (
                        <div key={contact._id}>
                          <ProfileImage contact={contact} imgClass="btn-img" />
                          {contact.firstName + ' ' + contact.lastName}
                        </div>
                      );
                    }
                  })}
                </div>
                <button className="create-btn" type="submit">
                  Create
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ChatPopup.propTypes = {
  setShowChatPopup: PropTypes.func,
  contacts: PropTypes.array,
  chats: PropTypes.array,
  setChats: PropTypes.func,
  user: PropTypes.object,
  socket: PropTypes.object,
};

export default ChatPopup;
