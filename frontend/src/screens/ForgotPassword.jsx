import { useState } from 'react';
import { Link } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();

    if (email === '' || email < 6) {
      setAlert({
        msg: 'Email is required',
        error: true,
      });
      return;
    }

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/users/forgot-password',
        { email }
      );
      setAlert({
        msg: data.msg,
        error: false,
      });
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
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Reset your password</h1>
        </div>
        {msg && <MessageBox alert={alert} />}
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label />
          <button className="primary" type="submit">
            Send Email
          </button>
        </div>
        <div className="row">
          <label />
          <div>
            New Customer? <Link to="/register">Create new account</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
