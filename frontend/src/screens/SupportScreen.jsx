import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import MessageBox from '../components/MessageBox';
import { useSelector } from 'react-redux';

let allUsers = []; // all users
let allMessages = []; // all messages
let allSelectedUser = {}; // selected user

const socketIO = io('http://127.0.0.1:8000', {
  transports: ['websocket', 'polling', 'flashsocket'],
});

export default function SupportScreen() {
  const [selectedUser, setSelectedUser] = useState({});

  const uiMessagesRef = useRef(null);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const { userInfo } = useSelector((state) => state.signin);
  
  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.scrollHeight,
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
        if (allSelectedUser._id === data._id) {
          allMessages = [...allMessages, data];
        } else {
          const existUser = allUsers.find((x) => x._id === data._id);
          if (existUser) {
            allUsers = allUsers.map((x) =>
              x._id === existUser._id ? { ...x, unread: true } : x
            );
            setUsers(allUsers);
          }
        }
        setMessages(allMessages);
      });
      socketIO.on('updateUser', (updatedUser) => {
        const existUser = allUsers.find((x) => x._id === updatedUser._id);
        if (existUser) {
          allUsers = allUsers.map((x) =>
            x._id === existUser._id ? updatedUser : x
          );
          setUsers(allUsers);
        } else {
          allUsers = [...allUsers, updatedUser];
          setUsers(allUsers);
        }
      });
      socketIO.on('listUsers', (updatedUsers) => {
        allUsers = updatedUsers;
        setUsers(allUsers);
      });
      socketIO.on('selectUser', (user) => {
        allMessages = user.messages;
        setMessages(socketIO);
      });
    }
  }, [userInfo._id, userInfo.name, userInfo.isAdmin]);

  const selectUser = (user) => {
    allSelectedUser = user;
    setSelectedUser(allSelectedUser);
    const existUser = allUsers.map((x) => x._id === user._id);
    if (existUser) {
      allUsers = allUsers.find((x) =>
        x._id === user._id ? { ...x, unread: undefined } : x
      );
      setUsers(allUsers);
    }
    socketIO.emit('onUserSelected', user);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert('Error. Please type message.');
    } else {
      allMessages = [
        ...allMessages,
        {
          body: messageBody,
          name: userInfo.name,
        },
      ];
      setMessages(allMessages);
      setMessageBody('');
      setTimeout(() => {
        socketIO.emit('onMessage', {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: selectedUser._id,
        });
      }, 1000);
    }
  };

  return (
    <div className="row top full-container">
      <div className="col-1 support-users">
        {users.filter((user) => user._id !== userInfo._id).length === 0 && (
          <MessageBox
            alert={{
              msg: 'No Online Users',
              error: true,
            }}
          />
        )}
        {users && users.length > 0 && (
          <MessageBox alert={{ msg: 'Online Users', error: false }} />
        )}
        <ul>
          {users
            .filter((user) => user._id !== userInfo._id)
            .map((user) => (
              <li
                key={user._id}
                className={user._id === selectedUser._id ? 'selected' : ''}
              >
                <button
                  type="button"
                  className="block"
                  onClick={() => selectUser(user)}
                >
                  {user.name}
                </button>
                <span
                  className={
                    user.unread ? 'unread' : user.online ? 'online' : 'offline'
                  }
                ></span>
              </li>
            ))}
        </ul>
      </div>

      <div className="col-3 support-messages">
        {!selectedUser._id ? (
          <MessageBox
            alert={{ msg: 'Select a user to start chat', error: true }}
          />
        ) : (
          <div className="row">
            <strong>Chat with {selectedUser.name}</strong>
            <ul ref={uiMessagesRef}>
              {messages.length === 0 && <li>No message</li>}
              {messages.map((msg, index) => (
                <li key={index}>
                  <strong>{msg.name}</strong>
                  <p>{msg.body}</p>
                </li>
              ))}
            </ul>
            <div>
              <form onSubmit={submitHandler} className="row">
                <input
                  type="text"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="type message"
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
