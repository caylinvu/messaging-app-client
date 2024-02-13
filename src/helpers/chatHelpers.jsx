// Check if chat with chosen contact already exists
export const checkExistingChats = (contact, chats) => {
  const existingChat = chats.find((obj) => {
    const userExists = obj.members.find((member) => {
      if (obj.members.length === 2 && member.toString() === contact._id) {
        return member;
      }
    });

    if (userExists) {
      return obj;
    }
  });

  return existingChat;
};

// Create a new chat and send to backend via socket
export const createNewChat = (contact, user, socket) => {
  // Create array with member id's
  const newMembers = [contact._id, user._id];

  const conv = {
    members: newMembers,
    isGroup: false,
    groupName: '',
    timestamp: new Date().toISOString(),
  };

  const convData = {
    conv: conv,
    receiver: contact._id,
  };

  // Send 'convData' object to backend
  socket.emit('createConversation', convData);
};
