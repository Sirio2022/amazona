import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { listUsers } from '../redux/userListSlice';
import Swal from 'sweetalert2';
import { deleteUser } from '../redux/deleteUserSlice';
import { useNavigate } from 'react-router-dom';

export default function UserListScreen() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({});

  const { loading, error, users } = useSelector((state) => state.userList);

  const {
    deletedUser,
    loading: LoadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.userDelete);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(listUsers());
    if (deletedUser) {
      setAlert({ msg: deletedUser.msg, error: false });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }
    if (errorDelete) {
      setAlert({ msg: errorDelete, error: true });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }

    if (error) {
      setAlert({ msg: error, error: true });
    }
  }, [dispatch, error, successDelete, deletedUser, errorDelete]);

  const deleteHandler = (user) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will not be able to recover ${user.name}'s account!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it!',
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#2196f3',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: `${user.name}'s account has been deleted.`,
          icon: 'success',
          confirmButtonColor: '#2196f3',
        });
        dispatch(deleteUser(user._id));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: `${user.name}'s account is safe :)`,
          icon: 'error',
          confirmButtonColor: '#2196f3',
        });
      }
    });
  };

  const { msg } = alert;

  return (
    <>
      <div>
        <h1>Users</h1>
      </div>
      {LoadingDelete && <LoadingBox />}

      {msg && <MessageBox alert={alert} />}

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
                  <button
                    type="button"
                    className="small"
                    onClick={() => navigate(`/user/${user._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="small"
                    type="button"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
