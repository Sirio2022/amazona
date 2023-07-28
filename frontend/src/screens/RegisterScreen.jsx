import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/registerSlice';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confimPassword, setConfimPassword] = useState('');
  const [alert, setAlert] = useState({});

  const { userInfo, error } = useSelector((state) => state.register);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    if ([name, email, password, confimPassword].includes('')) {
      setAlert({
        msg: 'All fields are required',
        error: true,
      });
      return;
    }

    if (password !== confimPassword) {
      setAlert({
        msg: 'Passwords do not match',
        error: true,
      });
      return;
    }
    if (password.length < 6) {
      setAlert({
        msg: 'Password must be at least 6 characters',
        error: true,
      });
      return;
    }
    setAlert({});

    dispatch(register(name, email, password));

    try {
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

    if (error) {
      setAlert({
        msg: error,
        error: true,
      });
    }
  };

  const { msg } = alert;

  return (
    <>
      <div>
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Register</h1>
          </div>
          {msg && <MessageBox alert={alert} />}
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confim-password"
              value={confimPassword}
              placeholder="Repeat your password"
              onChange={(e) => setConfimPassword(e.target.value)}
            />
          </div>
          <div>
            <label />
            <button className="primary" type="submit">
              Register
            </button>
          </div>
          <div className="row">
            <label />
            <div>
              Already have an account?{' '}
              <Link to="/signin">Create new account</Link>
            </div>
            <div>
              <Link to="/signin">Back to Sign In</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
