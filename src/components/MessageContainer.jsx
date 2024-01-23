import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

function MessageContainer({ messages, userDetails }) {
  return (
    <div className="msg-container">
      {messages.map((msg, index, arr) => {
        const prevMsg = arr[index - 1];
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

            <div className={msg.author._id === userDetails._id ? 'msg sent' : 'msg received'}>
              <p className="author">{msg.author.firstName}</p>
              <p className="text">{msg.text}</p>
              <p className="time">
                {DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.TIME_SIMPLE)}
              </p>
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
};
