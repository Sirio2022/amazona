import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function MessageBox({ alert }) {
  return (
    <div className={alert.error ? 'alert alert-danger' : 'alert alert-info'}>
      {alert.msg} {alert.link && <Link to="/">Go Shopping</Link>}{' '}
      {alert.link2 && <Link to="/signin">Sign In</Link>}
    </div>
  );
}

MessageBox.propTypes = {
  alert: PropTypes.object.isRequired,
};
