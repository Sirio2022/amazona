import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MessageBox from '../components/MessageBox';

export default function AccountConfirm() {
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  const params = useParams();

  const { id } = params;

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const url = `${
          import.meta.env.VITE_BACKEND_URL
        }/api/users/confirmation/${id}`;
        const { data } = await axios.get(url);

        setMsg(data.msg);

        setCuentaConfirmada(true);
      } catch (error) {
        setError(
          error.response && error.response.data.msg
            ? error.response.data.msg
            : error.message
        );
      }
    };
    confirmAccount();
  }, []);

  return (
    <>
      <div>
        <h1>Confirm account</h1>
      </div>

      {msg && <MessageBox variant="info">{msg}</MessageBox>}
      {error && <MessageBox variant="danger">{error}</MessageBox>}
      {cuentaConfirmada && (
        <div className="row center confirm">
          <Link to="/signin">Sign In</Link>
        </div>
      )}
    </>
  );
}
