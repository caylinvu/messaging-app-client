import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProfileImage from './ProfileImage';

function MessageContainer({ messages, userDetails, contacts, userHash, image }) {
  const { chatId } = useParams();
  const msgRef = useRef(null);

  const scrollToBottom = () => {
    msgRef.current.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    if (msgRef.current && messages.length > 0 && chatId === messages[0].conversation.toString()) {
      // console.log(messages);
      scrollToBottom();
    }
  }, [messages, image, chatId]);

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
                    <img
                      src={'http://localhost:3000/api/img/message/' + msg._id}
                      alt=""
                      draggable={false}
                      onLoad={() => {
                        if (msgRef.current) scrollToBottom();
                      }}
                    />
                  </div>
                )}
                <p className="text">{msg.text}</p>
                <p className="time">
                  {DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.TIME_SIMPLE)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={msgRef}></div>
    </div>
  );
}

export default MessageContainer;

MessageContainer.propTypes = {
  messages: PropTypes.array,
  userDetails: PropTypes.object,
  contacts: PropTypes.array,
  userHash: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
