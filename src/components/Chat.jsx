import { useParams } from 'react-router-dom';

function Chat() {
  const { chatId } = useParams();

  return (
    <div className="chat">
      <h1>CHAT {chatId}</h1>
    </div>
  );
}

export default Chat;
