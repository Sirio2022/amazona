import PropTypes from 'prop-types';

export default function MessageBox({ alert }) {
  console.log('alert', alert);
  return (
    <div className={alert.error ? 'alert alert-danger' : 'alert alert-info'}>
      {alert.msg}
    </div>
  );
}

MessageBox.propTypes = {
  alert: PropTypes.object.isRequired,
};
