import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/registerSlice';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confimPassword, setConfimPassword] = useState('');
  const [errorMSG, setErrorMSG] = useState('');
  const [infoMSG, setInfoMSG] = useState('');

  const { userInfo, loading, error } = useSelector((state) => state.register);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confimPassword) {
      alert('Password and Confirm Password Are Not Matched');
    } else {
      dispatch(register(name, email, password));
    }
  };

  useEffect(() => {
    if (userInfo.msg) {
      setInfoMSG(userInfo.msg);
    }
  }, [userInfo, loading]);

  useEffect(() => {
    if (error) {
      setErrorMSG(error);
      setTimeout(() => {
        setErrorMSG('');
      }, 5000);
    }
  }, [loading, error]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Register</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {infoMSG && <MessageBox variant="info">{infoMSG}</MessageBox>}
        {errorMSG && <MessageBox variant="danger">{errorMSG}</MessageBox>}
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confim-password"
            placeholder="Repeat your password"
            required
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
            <Link to="/forgot-password">Sign In</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
