import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MessageBox from '../components/MessageBox';

export default function AccountConfirm() {
  const [alert, setAlert] = useState({});
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

        setAlert({
          msg: data.msg,
          error: false,
        });

        setCuentaConfirmada(true);
      } catch (error) {
        setAlert({ msg: error.response.data.msg, error: true });
      }
    };
    //TODO: confirmar cuenta despues de pasar producción quitar ese return, solo dejar el llamado a la función, esto fue por el doble render.
    return () => {
      confirmAccount(); 
    };
  }, [id]);

  const { msg } = alert;

  return (
    <>
      <div>
        <h1>Confirm account</h1>
      </div>
      {msg && <MessageBox alert={alert} />}

      {cuentaConfirmada && (
        <div className="row center confirm">
          <Link to="/signin">Back to Sign In</Link>
        </div>
      )}
    </>
  );
}
