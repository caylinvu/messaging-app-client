import { useOutletContext, useNavigate } from 'react-router-dom';
import Intro from './Intro';
import { checkExistingChats, createNewChat } from '../helpers/chatHelpers';

function ContactPage() {
  const { contacts, chats, user, socket } = useOutletContext();
  const navigate = useNavigate();

  // Handle choosing contact to start new chat
  const startChat = (contact) => {
    // Check if chat with chosen contact already exists
    const existingChat = checkExistingChats(contact, chats);

    // If chat already exists, navigate to existing chat
    if (existingChat) {
      navigate('/chats/' + existingChat._id);
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
          {contacts.map((contact) => {
            if (contact._id !== user._id) {
              return (
                <button
                  onClick={() => startChat(contact)}
                  className="contact-preview"
                  key={contact._id}
                >
                  <div className="contact-img">
                    {contact.firstName.slice(0, 1)}
                    {contact.isOnline && <span>*</span>}
                  </div>
                  <div className="contact-name">{contact.firstName + ' ' + contact.lastName}</div>
                </button>
              );
            }
          })}
        </div>
      </div>
      <Intro isContactPage={true} />
    </div>
  );
}

export default ContactPage;
