export const receiveMessage = (chatId, message, messages, setMessages) => {
  if (chatId === message.conversation.toString()) {
    const newMessages = [...messages, message];
    const sortedMessages = newMessages.sort((x, y) => {
      return new Date(x.timestamp) - new Date(y.timestamp);
    });
    setMessages(sortedMessages);
  }
};
