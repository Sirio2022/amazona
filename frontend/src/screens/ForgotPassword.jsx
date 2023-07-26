import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const submitHandler = (e) => {};

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Reset your password</h1>
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
