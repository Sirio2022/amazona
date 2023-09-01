import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import MessageBox from '../components/MessageBox';
import { useSelector } from 'react-redux';

const socketIO = io('http://127.0.0.1:8000', {
  transports: ['websocket', 'polling', 'flashsocket'],
});

let allMessages = [];
let allUsers = [];
let allSelectedUser = {};

export default function SupportScreen() {
  const [selectedUser, setSelectedUser] = useState({});

  const uiMessagesRef = useRef(null);

  const [messages, setMessages] = useState({ body: '' });
  const [users, setUsers] = useState([]);
  const { userInfo } = useSelector((state) => state.signin);
  console.log(users);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: 'smooth',
      });
    }

    socketIO.emit('onLogin', {
      _id: userInfo._id,
      name: userInfo.name,
      isAdmin: userInfo.isAdmin,
    });

    socketIO.on('message', (data) => {
      if (allSelectedUser._id === data._id) {
        allMessages = [...allMessages, data];
      } else {
        const existUser = allUsers.find((user) => user._id === data._id);
        if (existUser) {
          allUsers.map((user) =>
            user._id === existUser._id ? { ...user, unread: true } : user
          );
          setUsers(allUsers);
        }
      }
      setMessages(allMessages);
    });
    socketIO.on('updateUser', (updatedUser) => {
      const existUser = allUsers.find((user) => user._id === updatedUser._id);
      if (existUser) {
        allUsers.map((user) =>
          user._id === existUser._id ? updatedUser : user
        );
        setUsers(allUsers);
      } else {
        const allUsers = [...allUsers, updatedUser];
        setUsers(allUsers);
      }
    });
    socketIO.on('listUsers', (updatedUsers) => {
      const allUsers = updatedUsers;
      setUsers(allUsers);
    });
    socketIO.on('selectUser', (user) => {
      const allMessages = user.messages;
      setMessages(allMessages);
    });
  }, [messages, userInfo._id, userInfo.name, userInfo.isAdmin]);

  const selectUser = (user) => {
    allSelectedUser = user;
    setSelectedUser(allSelectedUser);
    const existUser = allUsers.map((x) => x._id === user._id);
    if (existUser) {
      allUsers.find((x) => (x._id === user._id ? { ...x, unread: false } : x));
      setUsers(allUsers);
    }
    socketIO.emit('onUserSelected', user);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (messages.length === 0) {
      alert('Error. Please type message.');
    } else {
      allMessages = [
        ...allMessages,
        {
          body: messages.body,
          name: userInfo.name,
        },
      ];
      setMessages(allMessages);

      setTimeout(() => {
        socketIO.emit('onMessage', {
          body: messages.body,
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
        {users.filter(
          (x) =>
            (x._id !== userInfo._id).length === 0 && (
              <MessageBox alert={{ msg: 'No user found', error: true }} />
            )
        )}
        <ul>
          {users
            .filter((user) => user._id !== socketIO.Id && !user.isAdmin)
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
                />
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
              {allMessages.length === 0 && <li>No message</li>}
              {allMessages.map((msg, index) => (
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
                  value={messages.body}
                  onChange={(e) => setMessages({ body: e.target.value })}
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