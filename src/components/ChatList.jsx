import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

function ChatList({ chats, contacts, userDetails }) {
  return (
    <div className="chat-list">
      {chats.map((obj) => {
        let otherUser;
        if (!obj.isGroup) {
          const tmpUser = obj.members.find(
            (chatMember) => chatMember.toString() !== userDetails._id,
          );
          otherUser = contacts.find((contact) => contact._id === tmpUser.toString());
        }
        let userConv;
        if (userDetails.convData) {
          userConv = userDetails.convData.find((conv) => conv.conv.toString() === obj._id);
        }

        return (
          <Link to={'/chats/' + obj._id} key={obj._id}>
            <div className="chat-preview">
              <div className="chat-img">
                {obj.isGroup && obj.groupName.slice(0, 1)}
                {!obj.isGroup && otherUser && otherUser.firstName.slice(0, 1)}
                {!obj.isGroup && otherUser && otherUser.isOnline && <span>*</span>}
              </div>
              <div className="chat-details">
                <div className="preview-top">
                  <div>
                    {obj.isGroup && obj.groupName}
                    {!obj.isGroup && otherUser && otherUser.firstName + ' ' + otherUser.lastName}
                  </div>
                  <div className="preview-time">
                    {obj.lastMessage
                      ? DateTime.fromISO(obj.lastMessage.timestamp).toLocaleString(DateTime)
                      : DateTime.fromISO(obj.timestamp).toLocaleString(DateTime)}
                  </div>
                </div>
                <div className="preview-bottom">
                  <div className="preview-msg">
                    {obj.lastMessage ? obj.lastMessage.text : 'Started new chat'}
                  </div>
                  <div className="new-msg">
                    {(obj.lastMessage && userConv && !userConv.lastRead) ||
                    (obj.lastMessage && userConv && userConv.lastRead < obj.lastMessage.timestamp)
                      ? '*'
                      : ''}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

ChatList.propTypes = {
  chats: PropTypes.array,
  contacts: PropTypes.array,
  userDetails: PropTypes.object,
};

export default ChatList;
