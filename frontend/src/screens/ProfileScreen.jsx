import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser } from '../redux/userDetailSlice';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { updateUserProfileAction } from '../redux/updateUserProfileSlice';
import { useNavigate } from 'react-router-dom';

export default function ProfileScreen() {
  const [alert, setAlert] = useState({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

  const { userInfo } = useSelector((state) => state.signin);
  const { user, loading, error } = useSelector((state) => state.userDetails);
  const navigate = useNavigate();
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
      setName(userInfo.name);
      setEmail(userInfo.email);
      if (user.seller) {
        setSellerName(user.seller.name);
        setSellerLogo(user.seller.logo);
        setSellerDescription(user.seller.description);
      }
    }
    if (error) {
      setAlert({
        msg: error,
        error: true,
      });
    }
  }, [dispatch, userInfo._id, error, user, userInfo.name, userInfo.email]);

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
          sellerName,
          sellerLogo,
          sellerDescription,
        })
      );
      if (userProfile.name) {
        setAlert({
          msg: 'Profile Updated Successfully',
          error: false,
        });
        setTimeout(() => {
          navigate('/');
        }, 3000);
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
            {user.isSeller && (
              <>
                <h2>Seller</h2>
                <div>
                  <label htmlFor="seller-name">Seller Name</label>
                  <input
                    id="seller-name"
                    type="text"
                    placeholder="Enter Seller Name"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="seller-logo">Seller Logo</label>
                  <input
                    id="seller-logo"
                    type="text"
                    placeholder="Enter Seller Logo"
                    value={sellerLogo}
                    onChange={(e) => setSellerLogo(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="seller-description">Seller Description</label>
                  <input
                    id="seller-description"
                    type="text"
                    placeholder="Enter Seller Description"
                    value={sellerDescription}
                    onChange={(e) => setSellerDescription(e.target.value)}
                  />
                </div>
              </>
            )}
            <button className="primary block" type="submit">
              Update
            </button>
          </>
        )}
      </form>
    </div>
  );
}
