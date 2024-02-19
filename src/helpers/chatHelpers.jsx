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
  const newMembers = [contact._id, user._id];

  const conv = {
    members: newMembers,
    isGroup: false,
    groupName: '',
    timestamp: new Date().toISOString(),
  };

  const convData = {
    conv: conv,
    receivers: [contact._id],
  };

  socket.emit('createConversation', convData);
};

// Create new group chat and send to backend via socket
export const createNewGroup = (groupName, groupUsers, user, socket) => {
  const newMembers = [...groupUsers, user._id];

  const conv = {
    members: newMembers,
    isGroup: true,
    groupName: groupName,
    timestamp: new Date().toISOString(),
  };

  const convData = {
    conv: conv,
    receivers: groupUsers,
  };

  socket.emit('createConversation', convData);
};

// Sort chats based on lastMessage timestamp (or chat creation timestamp if no lastMessage)
export const sortChats = (chats) => {
  const sortedChats = chats.sort((x, y) => {
    if (x.lastMessage && y.lastMessage) {
      return new Date(y.lastMessage.timestamp) - new Date(x.lastMessage.timestamp);
    } else if (x.lastMessage && !y.lastMessage) {
      return new Date(y.timestamp) - new Date(x.lastMessage.timestamp);
    } else if (!x.lastMessage && y.lastMessage) {
      return new Date(y.lastMessage.timestamp) - new Date(x.timestamp);
    } else if (!x.lastMessage && !y.lastMessage) {
      return new Date(y.timestamp) - new Date(x.timestamp);
    }
  });

  return sortedChats;
};

// Handle removing exclusions locally
export const handleExclusions = (chat, chats, user) => {
  const exclusions = chat.exclude.filter((obj) => obj !== user._id);

  const updatedChats = chats.map((obj) => {
    if (obj._id === chat._id) {
      return {
        ...obj,
        exclude: exclusions,
      };
    } else {
      return obj;
    }
  });

  return updatedChats;
};
