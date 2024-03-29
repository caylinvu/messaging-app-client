import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfileImage from './ProfileImage';
import DatePreview from './DatePreview';

function ChatList({ chats, contacts, userDetails, groupHash, chatId }) {
  return (
    <div className="chat-list">
      {chats.map((obj) => {
        if (!obj.exclude.includes(userDetails._id)) {
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
              <div className={obj._id === chatId ? 'chat-preview selected-chat' : 'chat-preview'}>
                <ProfileImage
                  chat={obj}
                  contact={otherUser}
                  showOnlineStatus={true}
                  imgClass="chat-img"
                  groupHash={obj.isGroup ? groupHash : ''}
                />
                <div className="chat-details">
                  <div className="preview-top">
                    <div className="preview-name">
                      {obj.isGroup && obj.groupName}
                      {!obj.isGroup && otherUser && otherUser.firstName + ' ' + otherUser.lastName}
                    </div>
                    <div className="preview-time">
                      {obj.lastMessage ? (
                        <DatePreview timestamp={obj.lastMessage.timestamp} />
                      ) : (
                        <DatePreview timestamp={obj.timestamp} />
                      )}
                    </div>
                  </div>
                  <div className="preview-bottom">
                    <div className="preview-msg">
                      {obj.lastMessage
                        ? obj.lastMessage.image
                          ? 'Sent an image'
                          : obj.lastMessage.text
                        : obj.isGroup
                          ? 'Started new group chat'
                          : 'Started new chat'}
                    </div>
                    <div>
                      {obj._id === chatId ? (
                        ''
                      ) : (obj.lastMessage && userConv && !userConv.lastRead) ||
                        (obj.lastMessage &&
                          userConv &&
                          userConv.lastRead < obj.lastMessage.timestamp) ? (
                        <div className="new-msg"></div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        }
      })}
    </div>
  );
}

ChatList.propTypes = {
  chats: PropTypes.array,
  contacts: PropTypes.array,
  userDetails: PropTypes.object,
  groupHash: PropTypes.string,
  chatId: PropTypes.string,
};

export default ChatList;
