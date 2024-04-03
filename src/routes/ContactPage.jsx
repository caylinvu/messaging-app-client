import { useOutletContext, useNavigate } from 'react-router-dom';
import Intro from './Intro';
import { checkExistingChats, createNewChat, handleExclusions } from '../helpers/chatHelpers';
import { removeExclusion } from '../helpers/fetchHelpers';
import ProfileImage from '../components/ProfileImage';
import PropTypes from 'prop-types';

function ContactPage() {
  const { contacts, chats, setChats, user, socket } = useOutletContext();
  const navigate = useNavigate();

  // Handle choosing contact to start new chat
  const startChat = (contact) => {
    // Check if chat with chosen contact already exists
    const existingChat = checkExistingChats(contact, chats);

    // If chat already exists, navigate to existing chat
    if (existingChat) {
      if (existingChat.exclude.includes(user._id)) {
        const updatedChats = handleExclusions(existingChat, chats, user);
        removeExclusion(setChats, updatedChats, existingChat, user, navigate);
      } else {
        navigate('/chats/' + existingChat._id);
      }
    } else {
      // If chat does not exist, create new chat
      createNewChat(contact, user, socket);
    }
  };

  return (
    <div className="contact-page">
      <ContactColumn contacts={contacts} user={user} startChat={startChat} />
      <Intro isContactPage={true} />
    </div>
  );
}

function ContactColumn({ contacts, user, startChat }) {
  return (
    <div className="contact-column">
      <div className="contact-header">
        <h1>Contacts</h1>
      </div>
      <div className="contact-list">
        <ContactSection status="Online" contacts={contacts} user={user} startChat={startChat} />
        <ContactSection status="Offline" contacts={contacts} user={user} startChat={startChat} />
      </div>
    </div>
  );
}

function ContactSection({ status, contacts, user, startChat }) {
  return (
    <div className={status === 'Online' ? 'online-contacts' : 'offline-contacts'}>
      <h3>
        {status} -{' '}
        {
          contacts.filter(
            (obj) => obj._id !== user._id && (status === 'Online' ? obj.isOnline : !obj.isOnline),
          ).length
        }
      </h3>
      {contacts.map((contact) => {
        if (
          contact._id !== user._id &&
          (status === 'Online' ? contact.isOnline : !contact.isOnline)
        ) {
          return (
            <button
              onClick={() => startChat(contact)}
              className="contact-preview"
              key={contact._id}
            >
              <ProfileImage contact={contact} showOnlineStatus={true} imgClass="contact-img" />
              <div className="contact-name">{contact.firstName + ' ' + contact.lastName}</div>
            </button>
          );
        }
      })}
    </div>
  );
}

ContactColumn.propTypes = {
  contacts: PropTypes.array,
  user: PropTypes.object,
  startChat: PropTypes.func,
};

ContactSection.propTypes = {
  status: PropTypes.string,
  contacts: PropTypes.array,
  user: PropTypes.object,
  startChat: PropTypes.func,
};

export default ContactPage;
