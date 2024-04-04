import { sortChats } from './chatHelpers';

// Receive messages in Chat component
export const receiveMessage = (chatId, message, messages, setMessages) => {
  if (chatId === message.conversation.toString()) {
    const newMessages = [...messages, message];
    const sortedMessages = newMessages.sort((x, y) => {
      return new Date(x.timestamp) - new Date(y.timestamp);
    });
    setMessages(sortedMessages);
  }
};

// Update online status in Layout component
export const updateOnlineStatus = (contacts, currentUser, setContacts) => {
  const existingContact = contacts.find((obj) => obj._id === currentUser._id);
  if (existingContact) {
    const updatedContacts = contacts.map((contact) => {
      if (contact._id === currentUser._id) {
        return {
          ...contact,
          isOnline: currentUser.isOnline,
        };
      } else {
        return contact;
      }
    });
    setContacts(updatedContacts);
  } else if (!existingContact) {
    const newContacts = [...contacts, currentUser];
    const sortedContacts = newContacts.sort((a, b) => {
      let textA = a.firstName.toLowerCase();
      let textB = b.firstName.toLowerCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    setContacts(sortedContacts);
  }
};

// Receive new conversation in Layout component
export const receiveConversation = (
  data,
  chats,
  setChats,
  contacts,
  setContacts,
  user,
  userDetails,
) => {
  const newChats = [...chats, data.conversation];
  const sortedChats = sortChats(newChats);
  setChats(sortedChats);

  // Locally add new chat to current user's convData array
  const updatedConvs = [
    ...userDetails.convData,
    {
      conv: data.conversation._id,
    },
  ];
  const updatedUsers = contacts.map((obj) => {
    if (obj._id === user._id) {
      return {
        ...obj,
        convData: updatedConvs,
      };
    } else {
      return obj;
    }
  });
  setContacts(updatedUsers);
};

// Receive message preview in Layout component
export const receiveMessagePrev = (message, chats, setChats) => {
  const newChats = chats.map((chat) => {
    if (message.conversation.toString() === chat._id) {
      return {
        ...chat,
        lastMessage: message,
        exclude: [],
      };
    } else {
      return chat;
    }
  });
  const sortedChats = sortChats(newChats);
  setChats(sortedChats);
};
