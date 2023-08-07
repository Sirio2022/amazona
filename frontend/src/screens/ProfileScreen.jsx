import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser } from '../redux/userDetailSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { updateUserProfileAction } from '../redux/updateUserProfileSlice';

export default function ProfileScreen() {
  const [alert, setAlert] = useState({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.signin);
  const { user, loading, error } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    userProfile,
  } = useSelector((state) => state.userUpdateProfile);

  useEffect(() => {
    if (!user.name) {
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
    if (error) {
      setAlert({
        msg: error,
        error: true,
      });
    }
  }, [
    dispatch,
    userInfo._id,
    error,
    userProfile.name,
    userProfile.email,
    user,
    userProfile,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlert({
        msg: 'Password and Confirm Password are not match',
        error: true,
      });
    } else {
      dispatch(
        updateUserProfileAction({
          userId: user._id,
          name,
          email,
          password,
        })
      );
      if (userProfile.name) {
        setAlert({
          msg: 'Profile Updated Successfully',
          error: false,
        });
      }

      if (errorUpdate) {
        setAlert({
          msg: errorUpdate,
          error: true,
        });
      }
    }
  };

  const { msg } = alert;

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>User Profile</h1>
        </div>
        {loading ? (
          <LoadingBox />
        ) : (
          <>
            {loadingUpdate && <LoadingBox />}
            {msg && <MessageBox alert={alert} />}

            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <button className="primary block" type="submit">
              Update
            </button>
          </>
        )}
      </form>
    </div>
  );
}
