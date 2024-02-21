import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import ProfileImage from './ProfileImage';

function MessageContainer({ messages, userDetails, contacts }) {
  // Scroll to bottom of messages
  useEffect(() => {
    let msgContainer = document.getElementById('msg-container');
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, [messages]);

  return (
    <div id="msg-container">
      {messages.map((msg, index, arr) => {
        const prevMsg = arr[index - 1];
        const nextMsg = arr[index + 1];
        const author = contacts.find((contact) => msg.author.toString() === contact._id);
        return (
          <div className="msg-outer" key={msg._id}>
            {!prevMsg ? (
              <div className="full-date">
                {DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
              </div>
            ) : DateTime.fromISO(prevMsg.timestamp).toLocaleString(
                DateTime.DATE_MED_WITH_WEEKDAY,
              ) ===
              DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) ? (
              ''
            ) : (
              <div className="full-date">
                {DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
              </div>
            )}

            <div
              className={msg.author.toString() === userDetails._id ? 'msg sent' : 'msg received'}
            >
              {!nextMsg ||
              nextMsg.author !== msg.author ||
              DateTime.fromISO(nextMsg.timestamp).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) !==
                DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) ? (
                <ProfileImage contact={author} imgClass="msg-img" />
              ) : (
                <div className="msg-space"></div>
              )}
              <div className="msg-inner">
                <p className="author">{author.firstName}</p>
                <p className="text">{msg.text}</p>
                <p className="time">
                  {DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.TIME_SIMPLE)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageContainer;

MessageContainer.propTypes = {
  messages: PropTypes.array,
  userDetails: PropTypes.object,
  contacts: PropTypes.array,
};
