import { Outlet } from 'react-router-dom';

function ChatPage() {
  return (
    <div className="chat-page">
      <h1>CHAT PAGE</h1>
      <Outlet />
    </div>
  );
}

export default ChatPage;
