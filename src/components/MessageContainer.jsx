import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { useEffect, useRef, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import ProfileImage from './ProfileImage';
import { apiLink } from '../apiLink';

function MessageContainer({ messages, userDetails, contacts, userHash }) {
  const { chatId } = useParams();
  const msgRef = useRef(null);

  const scrollToBottom = () => {
    msgRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (msgRef.current && messages.length > 0 && chatId === messages[0].conversation.toString()) {
      scrollToBottom();
    }
  }, [messages, chatId]);

  return (
    <div className="reverse-container">
      <div ref={msgRef}></div>
      <div id="msg-container">
        {messages.map((msg, index, arr) => {
          const prevMsg = arr[index - 1];
          const nextMsg = arr[index + 1];
          const author = contacts.find((contact) => msg.author.toString() === contact._id);
          return (
            <Fragment key={msg._id}>
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
                DateTime.fromISO(nextMsg.timestamp).toLocaleString(
                  DateTime.DATE_MED_WITH_WEEKDAY,
                ) !==
                  DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) ? (
                  <ProfileImage
                    contact={author}
                    imgClass="msg-img"
                    userHash={msg.author.toString() === userDetails._id ? userHash : ''}
                  />
                ) : (
                  <div className="msg-space"></div>
                )}
                <div className="msg-inner">
                  <p className="author">{author.firstName}</p>
                  {msg.image && (
                    <div className="inner-img">
                      <img src={apiLink + '/api/img/message/' + msg._id} alt="" draggable={false} />
                    </div>
                  )}
                  <p className="text">{msg.text}</p>
                  <p className="time">
                    {DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.TIME_SIMPLE)}
                  </p>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

MessageContainer.propTypes = {
  messages: PropTypes.array,
  userDetails: PropTypes.object,
  contacts: PropTypes.array,
  userHash: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default MessageContainer;
