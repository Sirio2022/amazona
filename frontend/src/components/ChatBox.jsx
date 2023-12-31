import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

let socketIO;

export default function ChatBox(children) {
  const { userInfo } = children;

  const uiMessageRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([
    { body: 'Hello, there, Please ask your question', name: 'Admin' },
  ]);

  useEffect(() => {
    socketIO = io(import.meta.env.VITE_BACKEND_URL);
    if (uiMessageRef.current) {
      uiMessageRef.current.scrollBy({
        top: uiMessageRef.current.clientHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (socketIO) {
      socketIO.emit('onLogin', {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });
      socketIO.on('message', (data) => {
        setMessages([...messages, { body: data.body, name: data.name }]);
      });
    }
    return () => {
      if (socketIO) {
        socketIO.disconnect();
      }
    };
  }, [
    messages,
    isOpen,
    userInfo._id,
    userInfo.name,
    userInfo.isAdmin,
    messageBody,
  ]);

  const supportHandler = () => {
    setIsOpen(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert('Error. Please type messaage.');
    } else {
      setMessages([...messages, { body: messageBody, name: userInfo.name }]);
      setMessageBody('');
      setTimeout(() => {
        socketIO.emit('onMessage', {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: userInfo._id,
        });
      }, 500);
    }
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <div className="chatbox">
      {!isOpen ? (
        <button type="button" onClick={supportHandler}>
          <i className="fa fa-support"></i>
        </button>
      ) : (
        <div className="card card-body">
          <div className="row">
            <strong>Support</strong>
            <button type="button" onClick={closeHandler}>
              <i className="fa fa-close" />
            </button>
          </div>
          <ul ref={uiMessageRef}>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{`${msg.name}: `}</strong> {msg.body}
              </li>
            ))}
          </ul>
          <div>
            <form onSubmit={submitHandler} className="row">
              <input
                type="text"
                placeholder="type message"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
