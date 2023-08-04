import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser } from '../redux/userDetailSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';

export default function ProfileScreen() {
  const [alert, setAlert] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { userInfo } = useSelector((state) => state.signin);
  const { user, loading, error } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    if ([name, email].includes('')) {
      setAlert({
        msg: 'Please fill all fields',
        error: true,
      });
    }
    if (userInfo) {
      dispatch(detailsUser(userInfo._id));
    } else {
      setAlert({
        msg: 'You need to login first',
        error: true,
      });
    }
  }, [dispatch, userInfo, name, email]);

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch(updateUser({ userId: user._id, name, email}));
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>User Profile</h1>
        </div>
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
                value={user.name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={user.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <button className="primary block" type="submit">
              Update
            </button>
          </>
        )}
        <div className="row">
          <div>
            <Link to="/forgot-password">Forgot Password? </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
