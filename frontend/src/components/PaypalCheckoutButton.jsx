import PropTypes from 'prop-types';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useDispatch } from 'react-redux';
import { PayOrder } from '../redux/orderDetailsSlice';
import { useState } from 'react';

export default function PaypalCheckoutButton(props) {
  const [error, setError] = useState(null);
  const [paidFor, setPaidFor] = useState(false);
  const { order } = props;
  const dispatch = useDispatch();

  //const [paidFor, setPaidFor] = useState(false);
  // [paidFor, setPaidFor] = useState(false);
  //const [error, setError] = useState(null);

  const handleApprove = (paymentResult) => {
    // Call your server to save the transaction
    dispatch(PayOrder(order, paymentResult));

    // Set paidFor to true, so the PayPal button disappears
    setPaidFor(true);
  };
  // Set paidFor to true, so the PayPal button disappears
  //setPaidFor(true);
  // Refresh user´s account or subscription status, etc.
  if (paidFor) {
    // Display a success message, modal, or redirect to a success page
    alert(
      'Your payment was successful!. However, we were unable to update your account status. Please contact us.'
    );
  }

  // If the response is error
  // setError("Your payment was successful!. However, we were unable to update your account status. Please contact us.")
  // if (error) {
  // Display an error message, modal, or redirect to an error page.
  // alert('Your payment was successful!. However, we were unable to update your account status. Please contact us.');
  //}

  return (
    <>
      <PayPalButtons
        onClick={(data, actions) => {
          // Validate on button click , client or server side
          const hasAlreadyBought = false;
          if (hasAlreadyBought) {
            setError(
              'You have already bought this product. You cannot buy it again.'
            );
            return actions.reject();
          } else {
            return actions.resolve();
          }
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: order.totalPrice,
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          
          handleApprove(order, data.orderID);
        }}
        onCancel={(data) => {
          // Display a cancel message, modal, or redirect to the checkout page
          setError('You have cancelled the payment.');
        }}
        onError={(error) => {
          setError(error);
          console.error('PayPal Checkout onError', error);
        }}
      />
    </>
  );
}

PaypalCheckoutButton.propTypes = {
  order: PropTypes.object.isRequired,
};
