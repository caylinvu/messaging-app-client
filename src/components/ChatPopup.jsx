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
import Button from './Button';

function ChatPopup({ setShowChatPopup, contacts, chats, setChats, user, socket }) {
  const [isGroup, setIsGroup] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupError, setGroupError] = useState(null);
  const navigate = useNavigate();

  // Handle choosing contact to start new non-group chat
  const startChat = (contact) => {
    // Check if chat with chosen contact already exists
    const existingChat = checkExistingChats(contact, chats);

    // If chat already exists, navigate to existing chat
    if (existingChat) {
      if (existingChat.exclude.includes(user._id)) {
        const updatedChats = handleExclusions(existingChat, chats, user);
        removeExclusion(setChats, updatedChats, existingChat, user, navigate, setShowChatPopup);
      } else {
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
    if (groupName && groupUsers) {
      createNewGroup(groupName, groupUsers, user, socket);
      setShowChatPopup(false);
    }
  };

  return (
    <div className="blocker">
      <div className="popup-container">
        <div className="chat-popup">
          <button className="close-btn" onClick={() => setShowChatPopup(false)}>
            <img src="/close.svg" alt="" />
          </button>
          {!isGroup ? (
            <>
              <h3>Create a new chat</h3>
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
                        <div className="user-name">
                          {contact.firstName + ' ' + contact.lastName}
                        </div>
                      </button>
                    );
                  }
                })}
              </div>
            </>
          ) : isGroup && !isFinal ? (
            <>
              <button className="back-btn" onClick={goBack}>
                <img src="/arrow-back.svg" alt="" />
              </button>
              <h3>Select group members</h3>
              <div className="group-users">
                {contacts.map((contact) => {
                  if (contact._id !== user._id) {
                    return (
                      <label htmlFor={contact._id} key={contact._id} className="user-select">
                        <div className="label-info">
                          <ProfileImage contact={contact} imgClass="btn-img" />
                          <div className="user-name">
                            {contact.firstName + ' ' + contact.lastName}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="users"
                          id={contact._id}
                          value={contact._id}
                          onChange={(e) => handleChange(e)}
                          checked={groupUsers.includes(contact._id)}
                          className="checkbox-input"
                        />
                      </label>
                    );
                  }
                })}
              </div>
              {groupError && <span className="group-err">{groupError}</span>}
              <div className="btn-div">
                <Button
                  btnText="Next"
                  btnClass="next-btn"
                  btnType="button"
                  handleClick={selectUsers}
                />
              </div>
            </>
          ) : (
            <>
              <button className="back-btn" onClick={() => setIsFinal(false)}>
                <img src="/arrow-back.svg" alt="" />
              </button>
              <h3>Name group</h3>
              <form
                action=""
                className="create-group-form"
                onSubmit={startGroup}
                autoComplete="off"
              >
                <input
                  type="text"
                  name="groupName"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                  required
                  className="text-input"
                />
                <h3 className="members-title">Members</h3>
                <div className="added-users">
                  {contacts.map((contact) => {
                    if (groupUsers.includes(contact._id)) {
                      return (
                        <div key={contact._id}>
                          <ProfileImage contact={contact} imgClass="btn-img" />
                          <div className="user-name">
                            {contact.firstName + ' ' + contact.lastName}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                <div className="btn-div">
                  <Button btnText="Create" btnClass="create-btn" btnType="submit" />
                </div>
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
