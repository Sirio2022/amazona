import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../redux/signinSlice';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SigninScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({});

  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect');

  const { userInfo, loading, error } = useSelector((state) => state.signin);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    if ([email, password].includes('')) {
      setAlert({
        msg: 'All fields are required',
        error: true,
      });
      return;
    }

    try {
      dispatch(signin(email, password));
      setAlert({
        msg: userInfo.msg,
        error: false,
      });

      if (error) {
        setAlert({
          msg: error,
          error: true,
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (userInfo.name) {
      navigate(`/${redirect || ''}`);
    }
  }, [userInfo, navigate, redirect]);

  const { msg } = alert;

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Sign In</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {msg && <MessageBox alert={alert} />}
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Sign In
          </button>
        </div>
        <div className="row">
          <label />
          <div>
            New Customer? <Link to="/register">Create new account</Link>
          </div>
          <div>
            <Link to="/forgot-password">Forgot Password? </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
