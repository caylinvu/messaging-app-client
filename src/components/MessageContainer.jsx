import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

function MessageContainer({ messages, userDetails }) {
  return (
    <div className="msg-container">
      {messages.map((msg) => {
        return (
          <div
            key={msg._id}
            className={msg.author._id === userDetails._id ? 'msg sent' : 'msg received'}
          >
            <p className="author">{msg.author.firstName}</p>
            <p className="text">{msg.text}</p>
            <p className="time">
              {DateTime.fromISO(msg.timestamp).toLocaleString(DateTime.TIME_SIMPLE)}
            </p>
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
