import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import MessageBox from '../components/MessageBox';

export default function NewPassword() {
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({});
  const [validToken, setValidToken] = useState(false);
  const [modifiedPassword, setModifiedPassword] = useState(false);

  const params = useParams();

  const { token } = params;

  useEffect(() => {
    const checkToken = async () => {
      try {
        const url = `${
          import.meta.env.VITE_BACKEND_URL
        }/api/users/forgot-password/${token}`;
        await axios.get(url);
        setValidToken(true);
      } catch (error) {
        setAlert({ msg: error.response.data.msg, error: true });
      }
    };
    checkToken();
  }, [token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password === '' || password < 6) {
      setAlert({
        msg: 'Password is required, must be at least 6 characters',
        error: true,
      });
      return;
    }
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/users/forgot-password/${token}`;
      const { data } = await axios.post(url, { password });
      setAlert({
        msg: data.msg,
        error: false,
      });
      setModifiedPassword(true);
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alert;

  return (
    <div>
      {validToken && (
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Create new password</h1>
            {msg && <MessageBox alert={alert} />}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label />
            <button className="primary" type="submit">
              New password
            </button>
          </div>
        </form>
      )}
      {modifiedPassword && (
        <div className="row center confirm">
          <Link to="/signin">Back to Sign In</Link>
        </div>
      )}
    </div>
  );
}
