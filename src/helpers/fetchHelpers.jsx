// Remove a user id from exclusions list on chat
export const removeExclusion = async (
  setChats,
  updatedChats,
  chat,
  user,
  navigate,
  setShowChatPopup,
) => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/conversations/' + chat._id + '/include/' + user._id,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      },
    );
    if (response.status === 200) {
      setChats(updatedChats);
      navigate('/chats/' + chat._id);
      if (setShowChatPopup) {
        setShowChatPopup(false);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
