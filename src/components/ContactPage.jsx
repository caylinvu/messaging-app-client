import { useOutletContext, useNavigate } from 'react-router-dom';
import Intro from './Intro';
import { checkExistingChats, createNewChat, handleExclusions } from '../helpers/chatHelpers';
import { removeExclusion } from '../helpers/fetchHelpers';
import ProfileImage from './ProfileImage';

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
        console.log('User is included in exclusion');
        const updatedChats = handleExclusions(existingChat, chats, user);
        removeExclusion(setChats, updatedChats, existingChat, user, navigate);
      } else {
        console.log('User is not included in exclusion');
        navigate('/chats/' + existingChat._id);
      }
    } else {
      // If chat does not exist, create new chat
      createNewChat(contact, user, socket);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-column">
        <div className="contact-header">
          <h1>Contacts</h1>
        </div>
        <div className="contact-list">
          <div className="online-contacts">
            <h3>Online - {contacts.filter((obj) => obj.isOnline).length}</h3>
            {contacts.map((contact) => {
              if (contact._id !== user._id && contact.isOnline) {
                return (
                  <button
                    onClick={() => startChat(contact)}
                    className="contact-preview"
                    key={contact._id}
                  >
                    <ProfileImage
                      contact={contact}
                      showOnlineStatus={true}
                      imgClass="contact-img"
                    />
                    <div className="contact-name">{contact.firstName + ' ' + contact.lastName}</div>
                  </button>
                );
              }
            })}
          </div>
          <div className="offline-contacts">
            <h3>Offline - {contacts.filter((obj) => !obj.isOnline).length}</h3>
            {contacts.map((contact) => {
              if (contact._id !== user._id && !contact.isOnline) {
                return (
                  <button
                    onClick={() => startChat(contact)}
                    className="contact-preview"
                    key={contact._id}
                  >
                    <ProfileImage
                      contact={contact}
                      showOnlineStatus={true}
                      imgClass="contact-img"
                    />
                    <div className="contact-name">{contact.firstName + ' ' + contact.lastName}</div>
                  </button>
                );
              }
            })}
          </div>
          {/* {contacts.map((contact) => {
            if (contact._id !== user._id) {
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
          })} */}
        </div>
      </div>
      <Intro isContactPage={true} />
    </div>
  );
}

export default ContactPage;
