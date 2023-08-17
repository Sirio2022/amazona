import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { listUsers } from '../redux/userListSlice';

export default function UserListScreen() {
  const [alert, setAlert] = useState({});

  const { loading, error, success, users } = useSelector(
    (state) => state.userList
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listUsers());
    if (error) {
      setAlert({ msg: error, error: true });
    }
  }, [dispatch, error, success]);

  return (
    <>
      <div>
        <h1>Users</h1>
      </div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox alert={alert} />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS SELLER</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSeller ? 'YES' : 'NO'}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
