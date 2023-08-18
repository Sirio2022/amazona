import { useEffect, useState } from 'react';
import { detailsUser } from '../redux/userDetailSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, updateUserReset } from '../redux/updateUserSlice';
import Swal from 'sweetalert2';

export default function UserEditScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [alert, setAlert] = useState({});

  const params = useParams();
  const userId = params.id;

  const { user, loading, error } = useSelector((state) => state.userDetails);

  const {
    success,
    error: errorUpdate,
    loading: loadingUpdate,
  } = useSelector((state) => state.userUpdated);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || user._id !== userId || success) {
      dispatch(detailsUser(userId));
      dispatch(updateUserReset());
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsSeller(user.isSeller);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, user, userId, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch update user
    if (errorUpdate) {
      setAlert({ msg: errorUpdate, error: true });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }
    Swal.fire({
      title: 'User Updated!',
      text: `User ${name} has been updated.`,
      icon: 'success',
      confirmButtonColor: '#2196f3',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          updateUser({
            _id: userId,
            name,
            email,
            isSeller,
            isAdmin,
          })
        );
        navigate('/userlist');
      }
    });
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit User {name}</h1>
        </div>
        {loadingUpdate && <LoadingBox />}
        {errorUpdate && <MessageBox alert={alert} />}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox alert={alert} />
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="isSeller">Is Seller</label>
              <input
                id="isSeller"
                type="checkbox"
                checked={isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
              />
            </div>
            <div>
              <label htmlFor="isAdmin">Is Admin</label>
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </div>

            <div>
              <button type="submit" className="primary">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
